import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.put(
    `${baseUrl}/${newObject._id}`,
    newObject,
    config
  )
  return response.data
}

const deleteBlog = async (objectToDelete) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(
    `${baseUrl}/${objectToDelete.id}`,
    config
  )
  return response.data
}

const addComment = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(
    `${baseUrl}/${newObject.id}/comments`,
    { comment: newObject.comment },
    config
  )
  return response.data
}

export default { getAll, setToken, create, update, deleteBlog, addComment }
