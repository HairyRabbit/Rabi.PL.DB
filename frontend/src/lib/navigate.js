export function navigate(name) {
  const state = { page: name }

  return history => {
    history.pushState(state, name, `${name}.html`)
  }
}
