import {
  ActionFunctionArgs,
  Form,
  useActionData,
  useRouteError,
} from "react-router-dom";
import { PageContent, PageContentProps } from "../PageContainer";
import { Input } from "../Input";
import { Button } from "../Button";
import { ApiError } from "../../services/ApiService";
import { AuthService, AuthSession } from "../../services/AuthService";
import CheckCircle from "../icons/CheckCircle";
import { ROUTES } from "../../config/routes";
import { Helmet } from "react-helmet";

type SignUpPageProps = {} & PageContentProps;

export function Component({ ...props }: SignUpPageProps) {
  const apiError = useRouteError() as ApiError;
  const { token } = (useActionData() as AuthSession) ?? {};

  return (
    <>
      <Helmet>
        <title>Mutirão solidário - Registrar</title>
      </Helmet>
      {token ? (
        <PageContent {...props} fixedHeight>
          <h1 className="text-3xl font-bold text-center">Registro concluído</h1>
          <CheckCircle className="w-24 mx-auto text-green-500" />
          <Button
            onClick={() => {
              window.location.href = "/login";
            }}
            className="w-full"
          >
            Entrar
          </Button>
        </PageContent>
      ) : (
        <Form
          action={ROUTES.signUp}
          method="post"
          className="flex flex-col gap-4"
        >
          <PageContent {...props} fixedHeight>
            <h1 className="text-3xl font-bold text-center">
              Registre sua conta
            </h1>
            {Array.isArray(apiError?.errors) && (
              <div className="p-4 bg-red-100 border-red-500 rounded-lg">
                {apiError.errors.map(({ detail }, index) => (
                  <p key={index}>{detail}</p>
                ))}
              </div>
            )}

            <Input
              label="Nome"
              type="text"
              name="name"
              className="p-2 border rounded-lg"
              required
            />

            <Input
              label="E-mail"
              type="email"
              name="email"
              className="p-2 border rounded-lg"
              required
            />

            <Input
              label="Telefone"
              type="tel"
              name="phoneNumber"
              required
              className="p-2 border rounded-lg"
            />

            <Input
              label="Senha"
              type="password"
              name="password"
              className="p-2 border rounded-lg"
              required
              pattern=".{5,}"
              title="5 caracteres no mínimo"
            />

            <Button type="submit">Crie sua conta</Button>
          </PageContent>
        </Form>
      )}
    </>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const newUser = AuthService.signUp({
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    phoneNumber: formData.get("phoneNumber") as string,
  });

  return newUser;
}
