import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { db } from './firebase';
import { collection, addDoc, getDoc, getDocs } from 'firebase/firestore';
import { createUser } from './firestore/user';


function App() {
  const [count, setCount] = useState(0);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [users, setUsers] = useState([])

  // this useEffect will run ONCE on component mount
  // useful for setting initial values
  useEffect(() => {
    getAllUsers()
  }, [])
  

  const onCreateUser = async (e) => {
    e.preventDefault();

    // Trim input values
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    console.log("email: ", trimmedEmail)
    console.log("name: ", trimmedName)

    if (trimmedEmail && trimmedName) {
      const res = await createUser({email: trimmedEmail, name: trimmedName});
      console.log(res)
      //setEmail('')
      //setName('')
    } else {
      alert('Please fill out both fields')
    }
    getAllUsers()
  };

  const getAllUsers = async () => {
    try {
    const querySnapshot = await getDocs(collection(db, 'users')); // Use getDocs for collections
    const users = [];
    
    querySnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() }); // Add document data and ID to users array
    });
    
    setUsers(users); // Assuming setUsers updates your state or handles the data
  } catch (error) {
    console.error("Error getting users:", error);
  }
  }

  return (
    <>
     <div>
          <p>All users</p>
          <button onClick={getAllUsers}>Refresh</button>
        {users.length ? (
          <ul>
            {users.map(({ id, email, first_name }) => (
              <li key={id}>
                {email} {first_name} (id: {id})
              </li>
            ))}
          </ul>
        ) : (
          <p>No users currently</p>
        )}
      </div>
      <form onSubmit={onCreateUser}>
        <input
          className='p-1 m-2 rounded-lg'
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          name="email"
          required
          placeholder="Email"
        />
        <input
          className='p-1 m-2 rounded-lg'
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Name"
          name="name"
          required
          placeholder="Name"
        />
        <button type="submit">Create!</button>
      </form>
    </>
  );
}

export default App;
