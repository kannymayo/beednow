import { useState } from 'react'

function useForm<Type>(
  initialValues: Type
): [Type, (event: React.ChangeEvent<HTMLInputElement>) => void] {
  const [values, setV] = useState(initialValues)

  return [
    values,
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setV({
        ...values,
        [e.target.name]: e.target.value,
      })
    },
  ]
}

export { useForm }
