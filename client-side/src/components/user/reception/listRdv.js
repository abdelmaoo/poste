import { useState, useEffect } from 'react'
import { Tab } from '@headlessui/react'
import axios from "axios";
import { Await } from 'react-router';
const fetch = require('node-fetch');



function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ListRdv() {

  let [infos, setInfos] = useState([]);
  let [todos, setTodos] = useState([{}]);
  const user = JSON.parse(localStorage.getItem('user'));
  const id = user.id;
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

  let rdvs = {
    "a venir": tab.filter(rdv => rdv.validation == 0),
    "en cours": tab.filter(rdv => rdv.validation == 1),
    "termines": tab.filter(rdv => rdv.validation == 2),
  }
  console.log(rdvs)

  return (
    <div className="w-full max-w-4xl px-2 py-16 sm:px-0 mx-auto font-poste" id='modal_table'>
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
        <Tab.Panels className="mt-2">
          {Object.values(rdvs).map((posts, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                'rounded-xl bg-white p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}
            >
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="relative rounded-md mx-8 my-3 hover:bg-gray-100 grid grid-cols-3 grid-rows-3 gap-2"
                >
                  <div className="text-2xl place-self-start font-medium col-span-2 row-span-2 font-semibold my-auto">
                    {post.nom} - {post.direction}
                  </div>

                  <div className={classNames('row-span-2 my-auto font-semibold place-self-center',
                    post.heure_sortie ? 'row-span-1' : 'row-span-2')}>Heure d'entree: {post.heure_entree} </div>

                  {post.heure_sortie ? <div className='row-span-1 my-auto font-semibold place-self-center'>Heure de sortie: {post.heure_sortie} </div> : ''}


                  <div className='col-span-1 place-self-start'>Date: {post.date}</div>

                  {post.heure_sortie ?
                    '' :
                    post.validation === 0 ?
                      <div className='col-span-2 place-self-end'>
                        <button className='bg-jaune text-bleu rounded-md px-8 py-2 '>
                          Valider l'entree
                        </button>
                      </div>
                      :
                      < div className='col-span-2 place-self-end	'>
                        <button className='bg-jaune text-bleu rounded-md px-8 py-2 mx-2 '>
                          Valider la sortie
                        </button>
                        <button className='bg-bleu text-white rounded-md px-8 py-2 mx-2'>
                          Export
                        </button>
                      </div>

                  }

                  {/* <a
                      href="#"
                      className={classNames(
                        'absolute inset-0 rounded-md',
                        'ring-blue-400 focus:z-10 focus:outline-none focus:ring-2'
                      )}
                    /> */}
                </div>
              ))}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div >
  )
}
