import React from 'react'

export default function ImportableItem({ item }: { item: any }) {
  return (
    <>
      <label className="input-group flex place-items-center bg-gray-300">
        <input
          className="checkbox-primary checkbox-lg"
          type="checkbox"
          id="id"
        />
        {item?.name} {item?.id}
      </label>
    </>
  )
}
