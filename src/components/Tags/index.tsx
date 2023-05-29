import {
    Select, SelectProps, Tag, TagCloseButton, TagLabel, Wrap,
    WrapItem
} from "@chakra-ui/react";
import { useState } from "react";

interface SelectedTags {
    id: number;
    label: string;
}

interface Props extends SelectProps {
  tagOptions: SelectedTags[];
}

export const TagsSelect: React.FC<Props> = ({ tagOptions, ...selectProps }) => {
  const [selectedTags, setSelectedTags] = useState<SelectedTags[]>([]);
  const [availableTags, setAvailableTags] = useState<SelectedTags[]>(tagOptions);

  const handleAddTag = (tag: SelectedTags) => {
    setSelectedTags((selectedTags) => [...selectedTags, tag]);
    setAvailableTags((availableTags) =>
      availableTags.filter((availableTag) => availableTag.id !== tag.id)
    );
  };

  function handleRemoveTag(tag: SelectedTags) {
    setSelectedTags((selectedTags) =>
      selectedTags.filter((selectedTag) => selectedTag.id !== tag.id)
    );
    setAvailableTags((availableTags) => [...availableTags, tag]);
  }

  return (
    <>
      <Select
        placeholder="Selecione uma ou mais tags"
        onChange={(event) => {
          const selectedTagIds = Array.from(
            event.target.selectedOptions,
            (option) => parseInt(option.value)
          );
          const selectedTags = tagOptions.filter((tag) =>
            selectedTagIds.includes(tag.id)
          );
          selectedTags.forEach((tag) => handleAddTag(tag));
        }}
        {...selectProps}
      >
        {availableTags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.label}
          </option>
        ))}
      </Select>
      <Wrap mt="2" spacing="1">
        {selectedTags.map((tag) => (
          <WrapItem key={tag.id}>
            <Tag size="md" variant="solid" colorScheme="green">
              <TagLabel>{tag.label}</TagLabel>
              <TagCloseButton onClick={() => handleRemoveTag(tag)} />
            </Tag>
          </WrapItem>
        ))}
      </Wrap>
    </>
  );
};