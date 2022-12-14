import { useState, useEffect } from 'react'
import { Tab } from '@headlessui/react'
import Axios from "axios";
import { Await } from 'react-router';
const fetch = require('node-fetch');



function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ListRdv() {

  let [infos, setInfos] = useState([]);
  let [todos, setTodos] = useState([{}]);
  const user = JSON.parse(localStorage.getItem('user'));
  const [numberchange, setNumberchange] = useState('');
  const [HS, setHS] = useState('');

  // const id = user.id;
  const apiget5 = 'http://localhost:3001/get_rdv'


  useEffect(() => {
    const getTodos = async () => {
      try {
        const response = await fetch('http://localhost:3001/get_rdv')
        const jsonData = await response.json();
        if (response.ok) {
          setTodos(jsonData)
        }
      } catch (err) {
        console.error(err.message);
      }
    }
    getTodos();
  }, []);

  let tab = [...todos]

  const addPdf = (self) => {
    let da_rdv = tab.find(t => t.id == self.target.dataset.id)
    console.log(da_rdv)
    Axios.post('http://localhost:3001/document', {
       name: da_rdv.name,
       direction: da_rdv.direction,
       date: da_rdv.date,
       heure_entree: da_rdv.heure_entree,
       title: da_rdv.titre,
       motif: da_rdv.motif,
       type_rendezvous: da_rdv.type_rendezvous,
       numero_carte: da_rdv.numer_carte,
    }).then((response) => {
      console.log(response);
      console.log("daaaaaaaaa",da_rdv.direction)
    }).catch((err) => console.log(err));
  };

  const valEnt = (self) => {
    document.getElementById("cn-modal").style.display = "flex"
    document.getElementById("cn-btn").dataset.rdv = self.target.dataset.ent
  };

  const valSor = (self) => {
    document.getElementById("sortie-modal").style.display = "flex"
    document.getElementById("sor-btn").dataset.rdv = self.target.dataset.sor
  };
  let idrdv;
  const entrerCN = (self) => {
    console.log("tanessime2")
    idrdv = self.target.dataset.rdv
    console.log(idrdv)
    return idrdv
  };

  const addcarte = (self) => {
    console.log("tanessime")
    Axios.put("http://localhost:3001/carte", {
        idrdv: idrdv,
        numberchange: numberchange,
    }).then((response) => {
        console.log(response);
        console.log(idrdv, numberchange)
    }).catch((err) => console.log(err));
};
let idrdv2;
const entrerHS = (self) => {
  idrdv2 = self.target.dataset.rdv
  console.log(idrdv2)
};


const addhs = (self) => {
  console.log("tanessime")
  Axios.put("http://localhost:3001/hs", {
      idrdv2: idrdv2,
      HS: HS,
  }).then((response) => {
      console.log(response);
      console.log("idddd",idrdv2,"sortiiiiee", HS)
  }).catch((err) => console.log(err));
};



  window.onclick = function (event) {
    let cnmodal = document.getElementById("cn-modal")
    let sortie_modal = document.getElementById("sortie-modal")
    if (event.target == cnmodal) {
      cnmodal.style.display = "none";
      document.getElementById("cn-btn").dataset.rdv = -1

    }
    if (event.target == sortie_modal) {
      sortie_modal.style.display = "none";
    }
  }

  let day = new Date()
  day = day.toLocaleDateString()

  tab.map((rdv)=>{
    rdv.date = new Date(rdv.date).toLocaleDateString()
  })

  let rdvs = {
    "a venir": tab.filter(rdv => rdv.validation == 0 && rdv.date == day),
    "en cours": tab.filter(rdv => rdv.validation == 1 && rdv.date == day),
    "termines": tab.filter(rdv => rdv.validation == 2 && rdv.date == day),
  }

  return (
    <div className='font-poste mt-10'>
      <div className="w-full max-w-4xl px-2 py-16 sm:px-0 mx-auto" id='modal_table'>
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-bleu p-1">
            {Object.keys(rdvs).map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-base leading-5 text-bleu',
                    'ring-white ring-opacity-40 ring-offset-2 ring-offset-bleu focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white shadow'
                      : 'text-jaune hover:bg-white/[0.12] '
                  )
                }
              >
                RDVs {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-4">
            {Object.values(rdvs).map((posts, idx) => (
              <Tab.Panel
                key={idx}
                className={classNames(
                  'rounded-xl bg-gris ',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                )}
              >
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="relative rounded-md py-4 px-12 mx-2 mb-4 bg-white grid grid-cols-3 grid-rows-3 gap-2"
                  >
                    <div className="text-2xl place-self-start font-medium col-span-2 row-span-2 font-semibold my-auto">
                      {post.nom} - {post.direction}
                    </div>

                    <div className={classNames('row-span-2 my-auto font-semibold place-self-center',
                      post.heure_sortie ? 'row-span-1' : 'row-span-2')}>Heure d'entree: {post.heure_entree} </div>

                    {post.heure_sortie ? <div className='row-span-1 my-auto font-semibold place-self-center '>Heure de sortie: {post.heure_sortie} </div> : ''}


                    <div className='col-span-1 place-self-start'>Date: {post.date}</div>

                    {post.heure_sortie ?
                      '' :
                      post.validation === 0 ?
                        <div className='col-span-2 place-self-end'>
                          <button onClick={valEnt} data-ent={post.id} className='bg-jaune text-bleu rounded-md px-8 py-2 '>
                            Valider l'entree
                          </button>
                        </div>
                        :
                        < div className='col-span-2 place-self-end	'>
                          <button onClick={valSor} data-sor={post.id} className='bg-jaune text-bleu rounded-md px-8 py-2 mx-2 '>
                            Valider la sortie
                          </button>
                          <button onClick={addPdf} data-id={post.id} className='bg-bleu text-white rounded-md px-8 py-2 mx-2'>
                            Export 
                          </button>
                        </div>
                    }
                  </div>
                ))}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div >

      <div className="fixed hidden inset-0 bg-gray-600 bg-opacity-50  overflow-y-auto h-full items-center justify-center backdrop-blur-sm" id="cn-modal">
        <div className="relative p-4 lg:w-2/5 w-3/4 shadow-lg rounded-md bg-gris text-xl" >
          <div className='mt-5 sm:mt-0 px-8 py-2 '>
            <label htmlFor="name" className="block font-bold text-gray-700 p-4 mb-4 sm:px-0 bg-jaune rounded-full mx-24 text-bleu">
              Entrer numero de la piece d'identitee
            </label>
            <input
              placeholder='numero de la piece d identitee'
              type="text"
              name="cn"
              id="cn"
              onChange={(e) => setNumberchange(e.target.value)}
              required
              autoComplete="off"
              className="mt-1 block w-full rounded-md border border-gray-300 h-6 p-4"
            />
            <button className='bg-bleu text-white rounded-md px-8 py-2 m-2 place-self-end' id="cn-btn" onClick={
                 entrerCN
            }>
              Inserer numero carte
            </button>
            <button className='bg-bleu text-white rounded-md px-8 py-2 m-2 place-self-end' id="cn-btn" onClick={
                 addcarte
            }>
              Continuer
            </button>
          </div>
        </div>
      </div>

      <div className="fixed hidden inset-0 bg-gray-600 bg-opacity-50  overflow-y-auto h-full items-center justify-center backdrop-blur-sm" id="sortie-modal">
        <div className="relative p-4 lg:w-2/5 w-3/4 shadow-lg rounded-md bg-gris text-xl" >
          <div className='mt-5 sm:mt-0 px-8 py-2 '>
            <label htmlFor="name" className="block font-bold text-gray-700 p-4 mb-4 sm:px-0 bg-jaune rounded-full mx-24 text-bleu">
              Entrer l'heure de sortie
            </label>
            <input
              placeholder='Heure de sortie'
              type="time"
              name="hs"
              id="hs"
              onChange={(e) => setHS(e.target.value)}
              required
              autoComplete="off"
              className="mt-1 block w-full rounded-md border border-gray-300 p-4"
            />
            <button className='bg-bleu text-white rounded-md px-8 py-2 m-2 place-self-end' id="sor-btn" onClick={
                 entrerHS
            }>
              Inserer heure sortie
            </button>
            <button className='bg-bleu text-white rounded-md px-8 py-2 m-2 place-self-end' id='sor-btn' onClick={addhs}>
              Continuer
            </button>
          </div>
        </div>
      </div>
    </div >
  )
}
