import React, { useState } from 'react'

export default function AddClients() {
    const [client, setClient] = useState('')

    function handleClientChange(e) {
        setClient(e.target.value)
        console.log(e.target.value)
    }
  return (
    <div>
        <input type="text"  className='inputClients' value={client }placeholder='Click to add a client address' onChange={handleClientChange}/>
        <button className='addClientsBtn'>Add</button>
    </div>
  )
}
