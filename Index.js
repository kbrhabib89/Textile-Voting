import { useState } from 'react';

export default function Home() {
  const candidates = [
    { id: 1, name: 'Nexus 8' },
    { id: 2, name: 'Zenith 8' },
    { id: 3, name: 'Octa Weave 8' },
    { id: 4, name: 'Odyssey 8' },
    { id: 5, name: 'Oxygen 8' },
    { id: 6, name: 'Infinity 8' },
    { id: 7, name: 'Quantum 8' },
    { id: 8, name: 'Anomalous 8' }
  ];

  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = async () => {
    if (!selectedId) {
      alert('প্রথমে যেকোনো একটি নাম সিলেক্ট করুন!');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: selectedId })
      });
      const data = await res.json();
      setMessage(data.message);
      if (data.success) {
        setHasVoted(true);
      }
    } catch (err) {
      setMessage('কোথাও কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '450px', margin: 'auto', textAlign: 'center' }}>
      <h2 style={{ color: '#2c3e50' }}>টেক্সটাইল ৮ম ব্যাচ - নাম নির্বাচন</h2>
      <p style={{ color: '#7f8c8d', fontSize: '14px' }}>আপনার পছন্দের নামটি সিলেক্ট করুন। পরিচয় সম্পূর্ণ গোপন থাকবে এবং এক আইপি থেকে একবারই ভোট দিতে পারবেন।</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        {candidates.map((c) => (
          <button 
            key={c.id} 
            onClick={() => !hasVoted && setSelectedId(c.id)}
            disabled={hasVoted}
            style={{ 
              padding: '14px', 
              fontSize: '16px', 
              cursor: hasVoted ? 'not-allowed' : 'pointer', 
              borderRadius: '8px', 
              border: selectedId === c.id ? '2px solid #3498db' : '1px solid #ddd', 
              backgroundColor: selectedId === c.id ? '#ebf5fb' : '#fff',
              fontWeight: selectedId === c.id ? 'bold' : 'normal',
              transition: '0.2s'
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {!hasVoted && (
        <button 
          onClick={handleVote}
          disabled={loading || !selectedId}
          style={{ 
            marginTop: '25px', 
            width: '100%', 
            padding: '14px', 
            fontSize: '18px', 
            backgroundColor: '#27ae60', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'জমা হচ্ছে...' : 'ভোট কনফার্ম করুন'}
        </button>
      )}
      
      {message && (
        <div style={{ marginTop: '20px', padding: '12px', borderRadius: '6px', backgroundColor: hasVoted ? '#d4edda' : '#f8d7da', color: hasVoted ? '#155724' : '#721c24', fontWeight: 'bold' }}>
          {message}
        </div>
      )}
    </div>
  );
        }
