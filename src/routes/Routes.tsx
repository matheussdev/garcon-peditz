import { BrowserRouter, Route, Routes } from "react-router-dom";
import { EditMenuForm } from "../components/EditMenuForm";
import { MenuForm } from "../components/NewMenuForm";
import { ViewCommandModal } from "../components/ViewCommandModal";
import { Caixa } from "../pages/Caixa";
import { Comandas } from "../pages/comandas";
import { CreateNewOrder } from "../pages/CreateNewOrder/CreateNewOrder";
import { CreateUserForm } from "../pages/CreateUserForm";
import { EditAccount } from "../pages/EditAccount";
import { EditStore } from "../pages/EditStore";
import { EstoqueIngredientes } from "../pages/EstoqueIngredientes";
import { EstoqueProdutos } from "../pages/EstoqueProdutos";
import { Home } from "../pages/Home";
import { Ingredients } from "../pages/Ingredientes";
import { Integracoes } from "../pages/Integracoes";
import { Login } from "../pages/Login";
import { Menus } from "../pages/menus";
import { Mesas } from "../pages/Mesas";
import { MesaView } from "../pages/MesaView";
import { NewCompany } from "../pages/NewCompany";
import { NewStore } from "../pages/NewStore";
import { Orders } from "../pages/Orders";
import { Plans } from "../pages/Plans/Plans";
import { PointOfSales } from "../pages/PointOfSales";
import { ProductEdit } from "../pages/ProductEdit";
import { ProductForm } from "../pages/ProductForm";
import { Products } from "../pages/Products";
import { RecoverPassword } from "../pages/RecoverPassword";
import { Register } from "../pages/Register";
import { Support } from "../pages/Support";
import { UserEdit } from "../pages/UserEdit";
import { Users } from "../pages/Users";
import { Vouchers } from "../pages/Vouchers/Vouchers";
import { PrivateRoute, PrivateRouteWrapper } from "./PrivateRoute";
import { PublicRoute, PublicRouteWrapper } from "./PublicRoute";

export function Navigation() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login/" element={<PublicRoute />}>
          <Route
            path="/login/"
            element={
              <PublicRouteWrapper>
                <Login />
              </PublicRouteWrapper>
            }
          />
        </Route>
        <Route path="*" element={<>not found</>} />
        {/* <Route path="/" element={<PrivateRoute />}>
          <Route
            path="/"
            element={
              <PrivateRouteWrapper>
                <Home />
              </PrivateRouteWrapper>
            }
          />
        </Route> */}
        <Route path="/pedidos" element={<PrivateRoute />}>
          <Route
            path="/pedidos"
            element={
              <PrivateRouteWrapper title="Pedidos">
                <Orders />
              </PrivateRouteWrapper>
            }
          />
        </Route>
        <Route path="/planos" element={<PrivateRoute />}>
          <Route
            path="/planos"
            element={
              <PrivateRouteWrapper>
                <Plans />
              </PrivateRouteWrapper>
            }
          />
        </Route>
        <Route path="/ingredientes" element={<PrivateRoute />}>
          <Route
            path="/ingredientes"
            element={
              <PrivateRouteWrapper title="Ingredientes">
                <Ingredients />
              </PrivateRouteWrapper>
            }
          />
        </Route>
        <Route path="/estoque-produtos" element={<PrivateRoute />}>
          <Route
            path="/estoque-produtos"
            element={
              <PrivateRouteWrapper title="Estoque de produtos">
                <EstoqueProdutos />
              </PrivateRouteWrapper>
            }
          />
        </Route>
        <Route path="/estoque-ingredientes" element={<PrivateRoute />}>
          <Route
            path="/estoque-ingredientes"
            element={
              <PrivateRouteWrapper title="Estoque de ingredientes">
                <EstoqueIngredientes />
              </PrivateRouteWrapper>
            }
          />
        </Route>
        <Route path="/Integracoes" element={<PrivateRoute />}>
          <Route
            path="/Integracoes"
            element={
              <PrivateRouteWrapper title="Integrações">
                <Integracoes />
              </PrivateRouteWrapper>
            }
          />
        </Route>
        <Route path="/" element={<PrivateRoute />}>
          <Route
            path="/"
            element={
              <PrivateRouteWrapper title="Comandas">
                <Comandas />
              </PrivateRouteWrapper>
            }
          />
        </Route>
        <Route path="/comandas/:comandaId" element={<PrivateRoute />}>
          <Route
            path="/comandas/:comandaId"
            element={
              <PrivateRouteWrapper title="Vizualizando comanda">
                <ViewCommandModal />
              </PrivateRouteWrapper>
            }
          />
        </Route>
        <Route path="/pedidos/new/:comandaId" element={<PrivateRoute />}>
          <Route
            path="/pedidos/new/:comandaId"
            element={
              <PrivateRouteWrapper title="Lançar novo pedido">
                <CreateNewOrder />
              </PrivateRouteWrapper>
            }
          />
        </Route>
        <Route path="/users" element={<PrivateRoute />}>
          <Route
            path="/users"
            element={
              <PrivateRouteWrapper title="Usuários">
                <Users />
              </PrivateRouteWrapper>
            }
          />
        </Route>
        <Route path="/users/create" element={<PrivateRoute />}>
          <Route
            path="/users/create"
            element={
              <PrivateRouteWrapper title="Adicionar novo usuário">
                <CreateUserForm />
              </PrivateRouteWrapper>
            }
          />
        </Route>
        <Route path="/users/edit/:userId" element={<PrivateRoute />}>
          <Route
            path="/users/edit/:userId"
            element={
              <PrivateRouteWrapper title="Editar usuário">
                <UserEdit />
              </PrivateRouteWrapper>
            }
          />
        </Route>
        <Route path="/mesas" element={<PrivateRoute />}>
          <Route
            path="/mesas"
            element={
              <PrivateRouteWrapper title="Mesas">
                <Mesas />
              </PrivateRouteWrapper>
            }
          />
        </Route>
        <Route path="/mesas/visualizar" element={<PrivateRoute />}>
          <Route
            path="/mesas/visualizar"
            element={
              <PrivateRouteWrapper title="Informações da mesa">
                <MesaView />
              </PrivateRouteWrapper>
            }
          />
        </Route>
        <Route path="/vouchers" element={<PrivateRoute />}>
          <Route
            path="/vouchers"
            element={
              <PrivateRouteWrapper title="Vouchers">
                <Vouchers />
              </PrivateRouteWrapper>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
