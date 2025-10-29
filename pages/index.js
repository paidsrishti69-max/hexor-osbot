import { useState } from 'react'

export default function Home(){
  const [q,setQ] = useState('')
  const [res,setRes] = useState(null)
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(null)

  async function onSearch(){
    setError(null)
    setRes(null)
    if(!q) return setError('Enter a number to search')
    setLoading(true)
    try{
      const r = await fetch(`/api/search?num=${encodeURIComponent(q)}`)
      if(r.status===200){
        const data = await r.json()
        setRes(data)
      } else {
        const e = await r.json().catch(()=>({error:'Not found'}))
        setError(e.error||e.message||'Not found')
      }
    }catch(err){
      setError('Request failed')
    }finally{setLoading(false)}
  }

  return (
    <div className="min-h-screen">
      <div className="container">
        <header className="flex justify-between items-center mb-6">
          <div className="header-title">Hexor</div>
          <div className="small-muted">Channel &nbsp; | &nbsp; Contact</div>
        </header>

        <div className="card">
          <div className="font-semibold">Number Lookup</div>
          <p className="small-muted">Enter a phone number (e.g. 9971920491) and click Search.</p>
          <div className="mt-4 flex gap-3">
            <input value={q} onChange={e=>setQ(e.target.value)} className="search-input flex-1" placeholder="Enter phone number" />
            <button onClick={onSearch} className="px-4 py-2 rounded bg-blue-600 text-white">Search</button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="card mb-4 flex justify-between items-center">
              <div>
                <div className="font-semibold text-sky-300">Search Results</div>
                <div className="small-muted">{res ? '1 record' : 'No results yet'}</div>
              </div>
            </div>

            <div>
              {loading && <div className="card">Searching...</div>}
              {error && <div className="card text-red-400">{error}</div>}
              {res && <div className="record-card">
                <div className="text-lg font-bold">{res.name}</div>
                <div className="small-muted">Father: {res.father}</div>
                <div className="mt-2"><strong>Number:</strong> {res.number}</div>
                <div><strong>Linked:</strong> {res.linked_number}</div>
                <div><strong>Circle:</strong> {res.circle}</div>
                <div><strong>Aadhaar:</strong> {res.aadhar}</div>
                <div className="mt-2 small-muted">Address: <div className="whitespace-pre-wrap text-xs">{res.address}</div></div>
                <div className="mt-2"><strong>Email:</strong> {res.email}</div>
              </div>}
            </div>
          </div>

          <div>
            <div className="card">
              <div className="font-semibold text-sky-300">Location Map</div>
              <div className="mt-3">
                <iframe src="https://maps.google.com/maps?q=delhi&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height="200" frameBorder="0"></iframe>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
