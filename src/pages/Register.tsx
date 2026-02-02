import React, { useState } from 'react'
import axios from 'axios'

type Form = {
  name: string
  email: string
  password: string
  confirm: string
}

type User = {
  id: number
  name: string
  email: string
  password: string
}

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState<Form>({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof Form
    const value = e.target.value
    setForm((f) => ({ ...f, [name]: value }))
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Tên không được để trống.'
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email không hợp lệ.'
    if (form.password.length < 6) errs.password = 'Mật khẩu ít nhất 6 ký tự.'
    if (form.password !== form.confirm) errs.confirm = 'Mật khẩu nhập lại không khớp.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess('')
    if (!validate()) return

    try {
      const base = 'http://localhost:3000'
      const { data: existing } = await axios.get<User[]>(`${base}/users`, { params: { email: form.email } })
      if (existing && existing.length > 0) {
        setErrors({ email: 'Email đã được sử dụng.' })
        return
      }

      await axios.post(`${base}/users`, {
        name: form.name,
        email: form.email,
        password: form.password
      })

      setSuccess('Đăng ký thành công. Bạn có thể đăng nhập bây giờ.')
      setForm({ name: '', email: '', password: '', confirm: '' })
      setErrors({})
    } catch (err) {
      console.error(err)
      setErrors({ general: 'Đã có lỗi xảy ra. Vui lòng thử lại.' })
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '24px auto', padding: 16 }}>
      <h2>Đăng ký</h2>
      {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 12 }}>
          <label>Họ và tên</label>
          <input name="name" value={form.name} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
          {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
          {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Mật khẩu</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
          {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Nhập lại mật khẩu</label>
          <input name="confirm" type="password" value={form.confirm} onChange={handleChange} style={{ width: '100%', padding: 8 }} />
          {errors.confirm && <div style={{ color: 'red' }}>{errors.confirm}</div>}
        </div>

        <button type="submit" style={{ padding: '8px 16px' }}>
          Đăng ký
        </button>
      </form>
    </div>
  )
}

export default RegisterPage
