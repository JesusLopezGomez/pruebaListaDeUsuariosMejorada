import { ChangeEvent, useMemo, useState } from 'react'
import './App.css'
import { SortBy, type User } from './types.d'
import { UsersList } from './components/UsersList'
import { useUsers } from './hooks/useUsers'
import { Resutls } from './components/Results'


function App() {
  const {isLoading, isError, fetchNextPage, hasNextPage, refetch, users} = useUsers();
  
  const [showColors, setShowColors] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  //const originalUsers = useRef<User[]>([])

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const toggleSortByCountry = () => {
    const newSortingValue = sorting == SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const handleReset = () => {
    void refetch()
  }

  const handleChangeFilterCountry = (event:ChangeEvent<HTMLInputElement>) => {
    setFilterCountry(event.target.value)
  }

  const handleChangeSort = (sort : SortBy) => {
    setSorting(sort)
  }

  const filteredUser = useMemo(() => {
    return filterCountry != null && filterCountry.length > 0
      ? users.filter((user => {
        return user.location.country.toLocaleLowerCase()
          .includes(filterCountry.toLocaleLowerCase());
  })) : users},[users, filterCountry])

  const sortedUsers = useMemo(() => {
    
    if(sorting == SortBy.NONE) return filteredUser;

    const compareProperties: Record<string, (user: User) => any> = {
      [SortBy.COUNTRY] : user => user.location.country,
      [SortBy.NAME] : user => user.name.first,
      [SortBy.LAST] : user => user.name.last,
    }

    return [... filteredUser].sort((a,b) => {
      const extractProperty = compareProperties[sorting]
      return extractProperty(a).localeCompare(extractProperty(b));
    })

  },[filteredUser, sorting])

  return (
    <div className='App'>
      <h1>Prueba técnica</h1>
      <Resutls></Resutls>
      <header>
        <button onClick={toggleColors}>Colorear filas</button>
        <button onClick={toggleSortByCountry}>
          {sorting == SortBy.COUNTRY ? 'No ordenar por país' : 'Ordenar por país'}
        </button>
        <button onClick={handleReset}>Resetear usuarios</button>
        <input type="text" placeholder='Filtra por país' onChange={handleChangeFilterCountry}/>
      </header>
      <main>

        {users.length > 0 && 
          <UsersList changeSorting={handleChangeSort} users={sortedUsers} showColors={showColors} />}
        
        {isLoading && <p>Cargando...</p>}
        
        {!isLoading && isError && <p>Ha habido un error</p>}

        {!isLoading && !isError && users.length == 0 && <p>No hay usuarios</p>}
        
        {!isLoading && !isError && hasNextPage == true 
        && <button onClick={ () => { void fetchNextPage()}}>Cargar más resultados</button>}
      
      {!isLoading && !isError && hasNextPage == false 
        && <p>No hay más resultados</p>}
      </main>
    </div>
  )
}

export default App
