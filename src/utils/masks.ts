export function telMask(number:string){
    number=number.replace(/\D/g,"")                 //Remove tudo o que não é dígito
    number=number.replace(/^(\d\d)(\d)/g,"($1) $2") //Coloca parênteses em volta dos dois primeiros dígitos
    number=number.replace(/(\d{5})(\d)/,"$1-$2")    //Coloca hífen entre o quarto e o quinto dígitos
    return number
}

export function cepMask(number:string){
    number=number.replace(/\D/g,"")                 //Remove tudo o que não é dígito

    number=number.replace(/(\d{5})(\d)/,"$1-$2")    //Coloca hífen entre o quarto e o quinto dígitos
    return number
}

export default function slugify(text: string) {
    const from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;'
    const to = 'aaaaaeeeeeiiiiooooouuuunc------'
  
    const newText = text
      .split('')
      .map((letter, i) =>
        letter.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
      )
  
    return newText
      .toString() // Cast to string
      .toLowerCase() // Convert the string to lowercase letters
      .trim() // Remove whitespace from both sides of a string
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/&/g, '-y-') // Replace & with 'and'
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
  }
  