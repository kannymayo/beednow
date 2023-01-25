import React from 'react'

export default function ImportableItem({ id }: { id: number }) {
  return (
    <>
      <label className="input-group flex place-items-center bg-gray-300">
        <input
          className="checkbox-primary checkbox-lg"
          type="checkbox"
          id="id"
        />
        very long name {id}
      </label>
    </>
  )
}
