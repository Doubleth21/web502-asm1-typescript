import React, { useState } from 'react'

type LoginForm = {
  email: string
  password: string
}

type User = {
  id: number
  name: string
  email: string
  password: string
}

const LoginPage: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof LoginForm
    const value = e.target.value
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Email không hợp lệ.')
      return
    }
    if (!form.password) {
      setError('Mật khẩu không được để trống.')
      return
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[]
    const user = users.find((u) => u.email === form.email && u.password === form.password)
    if (!user) {
      setError('Thông tin đăng nhập không chính xác.')
      return
    }

    localStorage.setItem('currentUser', JSON.stringify({ id: user.id, name: user.name, email: user.email }))
    setSuccess('Đăng nhập thành công.')
    setForm({ email: '', password: '' })
  }

  return (
    <div style={{ maxWidth: 480, margin: '24px auto', padding: 16 }}>
      <h2>Đăng nhập</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Mật khẩu</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
        </div>

        <button type="submit" style={{ padding: '8px 16px' }}>
          Đăng nhập
        </button>
      </form>
    </div>
  )
}

export default LoginPage
