import { useUsers } from "../hooks/useUsers"

export const Resutls = () => {
  const {users} = useUsers();

  return <h3>Resultados {users.length}</h3>
}