export interface Task {
  id?: string | null,
  title: string,
  description: string,
  items: Item[]
}

export interface Item {
  name: string,
  complete: boolean,
}
