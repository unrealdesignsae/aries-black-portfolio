import React, { useState, useEffect, useRef } from 'react'

const PASSWORD = '2403'
const SESSION_KEY = 'ab_auth'

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!authed) inputRef.current?.focus()
  }, [authed])

  if (authed) return <>{children}</>

  const submit = () => {
    if (value === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setAuthed(true)
    } else {
      setError(true)
      setShake(true)
      setValue('')
      setTimeout(() => setShake(false), 500)
      inputRef.current?.focus()
    }
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submit()
    if (error) setError(false)
  }

  return (
    <div className="pg-root">
      <div className="pg-bg" />
      <div className={`pg-card ${shake ? 'pg-shake' : ''}`}>
        <div className="pg-logo">AB.</div>
        <p className="pg-label">Enter access code</p>
        <input
          ref={inputRef}
          type="password"
          className={`pg-input ${error ? 'pg-input--err' : ''}`}
          value={value}
          onChange={e => { setValue(e.target.value); if (error) setError(false) }}
          onKeyDown={onKey}
          maxLength={12}
          autoComplete="off"
          placeholder="····"
        />
        {error && <p className="pg-error">Incorrect code</p>}
        <button className="pg-btn" onClick={submit}>Enter</button>
      </div>
    </div>
  )
}
