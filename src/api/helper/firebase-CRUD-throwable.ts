import {
  doc,
  getDoc,
  deleteDoc,
  setDoc,
  updateDoc,
  collection,
} from 'firebase/firestore'

import { db } from '@/api/firebase'
import { isVoid } from '@/utils/is-void'

/**
 * Throws on any void segment.
 */
async function getFirebaseDoc<TData>({
  segments,
}: {
  segments: (string | undefined)[]
}) {
  if (segments.some(isVoid)) throw new Error('Invalid path')
  const _segments = segments as string[]

  const docRef = doc(db, _segments[0], ..._segments.slice(1))
  const docSnap = await getDoc(docRef)
  // docRef could exist for a new doc that has not been written to yet
  if (docSnap.exists()) return docSnap.data() as TData
}

/**
 * Throws on any void segment. Or undefined id.
 *
 * If you want to create a doc with auto-generated ID, pass in null for id.
 * If you don't know the ID yet, pass in undefined, but never null. This
 * causes the function to throw, but it is the expected behavior.
 */
async function upcreateFirebaseDoc({
  segments,
  data,
  options,
}: {
  segments: (string | undefined)[]
  data: { [any: string]: any }
  options?: { [any: string]: any }
}) {
  if (segments.some(isVoid)) throw new Error('Invalid path')
  const _segments = segments as string[]

  const docRef = doc(db, _segments[0], ..._segments.slice(1))
  await setDoc(docRef, data, {
    merge: true,
    ...options,
  })
}

async function upcreateFirebaseDocWithAutoId({
  segments,
  data,
  options,
}: {
  segments: (string | undefined)[]
  data: { [any: string]: any }
  options?: { [any: string]: any }
}) {
  if (segments.some(isVoid)) throw new Error('Invalid path')

  const _segments = segments as string[]
  const docRef = doc(collection(db, _segments[0], ..._segments.slice(1)))

  await setDoc(docRef, data, {
    merge: true,
    ...options,
  })
  return docRef.id
}

/**
 * For using with dot notation only?
 */
async function updateFirebaseDoc({
  segments,
  data,
}: {
  segments: (string | undefined)[]
  data: { [any: string]: any }
  options?: { [any: string]: any }
}) {
  if (segments.some(isVoid)) throw new Error('Invalid path')
  const _segments = segments as string[]

  const docRef = doc(db, _segments[0], ..._segments.slice(1))
  await updateDoc(docRef, data)
}

async function deleteFirebaseDoc({
  segments,
}: {
  segments: (string | undefined)[]
}) {
  if (segments.some(isVoid)) throw new Error('Invalid path')
  const _segments = segments as string[]

  const docRef = doc(db, _segments[0], ..._segments.slice(1))
  await deleteDoc(docRef)
}

export {
  upcreateFirebaseDoc,
  upcreateFirebaseDocWithAutoId,
  updateFirebaseDoc,
  deleteFirebaseDoc,
  getFirebaseDoc,
}
