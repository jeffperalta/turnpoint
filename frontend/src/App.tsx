import { useEffect, useState } from 'react';
import { Client } from './models/Client';
import { ClientService } from './services/ClientService';
import './App.css';

const clientService = new ClientService();


function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [client, setClient] = useState<Client>(new Client());

  useEffect(() => {
    clientService.getAll()
      .then(setClients)
      .catch(console.error);

    clientService.getById(1)
      .then(setClient)
      .catch(console.error);   
  }, []);

  const clickCreate = () => {
    clientService.create(new Client({
      name: 'Teddy',
      identification: '123123',
      dob: new Date(),
      main_language: 'Mandarin',
      funding_source_id: 1
    })).then((response) => {
      console.log(">>>Response", response)
    })
  }

  const clickUpdate = () => {
    clientService.update(22, new Client({
      name: 'Teddy',
      identification: '123123',
      dob: new Date(),
      main_language: 'Mandarin',
      funding_source_id: 3
    })).then((response) => {
      console.log(">>>Response", response)
    })
  }

  const clickDelete = () => {
    clientService.delete(22).then((response) => {
      console.log(">>>Response", response)
    })
  }

  return (
    <div className="App">
      <div>
        <h2>Clients</h2>
          {clients.map((client) => (
            <div key={client.id}>
              {client.name} - {client.funding_source_name}
            </div>
          ))}

          <div>
            Client:
            {client.name} {client.dob}
          </div>

          <button onClick={clickCreate}>Create</button>
          <button onClick={clickUpdate}>Update</button>
          <button onClick={clickDelete}>Delete</button>
          
      </div>
    </div>
  );
}

export default App;
