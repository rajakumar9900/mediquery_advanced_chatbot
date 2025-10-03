import { useEffect, useState } from 'react'

export default function HistoryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // For now, just show empty history
    setItems([])
    setLoading(false)
    console.log('History page loaded (simplified)')
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>

  const formatTimestamp = (timestamp) => {
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString()
    }
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Chat History</h2>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to clear all chat history?')) {
              setItems([])
              console.log('History cleared (simplified)')
            }
          }}
          className="btn !bg-red-600 !text-white text-sm"
        >
          Clear History
        </button>
      </div>
      
      {items.map((it) => (
        <div key={it.id} className="rounded-md border border-gray-300 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
          <div className="text-xs text-gray-500 mb-3">{formatTimestamp(it.timestamp)}</div>
          <div className="mb-3">
            <span className="font-semibold text-blue-600">You:</span> 
            <div className="mt-1 text-gray-800 dark:text-gray-200">{it.message}</div>
          </div>
          <div className="whitespace-pre-wrap">
            <span className="font-semibold text-green-600">MediQuery:</span> 
            <div className="mt-1 text-gray-800 dark:text-gray-200">{it.response}</div>
          </div>
        </div>
      ))}
      {items.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <p>No chat history yet.</p>
          <p className="text-sm mt-2">Start a conversation in the chat to see your history here.</p>
        </div>
      )}
    </div>
  )
}


