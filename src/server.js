import fastify  from fastify
import cors from '@fastify/cors'
const app = fastify()

app.register(cors, {
  origin: ""
})

export function bootstrap() { 
  const PORT = process.env.PORT || 30000
  app.listen({ port: PORT }, () => {
    console.log(`Server running on port ${PORT}`)
  })
}
