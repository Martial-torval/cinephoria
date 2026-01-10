import LoginForm from "./components/LoginForm";

export default function Unauthorized() {
  return (
    <main>
      <h1>401 - Non autorisé</h1>
      <p>Connectez vous pour accéder à cette page</p>
      <LoginForm />
    </main>
  );
}
