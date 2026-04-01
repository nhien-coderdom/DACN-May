import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '../hook'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function LoginForm() {
  const navigate = useNavigate()
  const { mutate: handleLogin, isPending } = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    handleLogin(
      { email, password },
      {
        onSuccess: (response) => {
          if (response.user.role === 'ADMIN' || response.user.role === 'STAFF') {
            navigate('/')
          } else {
            alert("You don't have permission to access admin panel")
          }
        },
      }
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <div className="w-[360px] space-y-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-sm text-muted-foreground">Enter your account information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="admin@may.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button className="w-full" disabled={isPending}>
            {isPending ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  )
}
