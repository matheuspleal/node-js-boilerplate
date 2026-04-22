export abstract class WatchedList<T> {
  private currentItems: T[]
  private initial: T[]
  private newItems: T[]
  private removedItems: T[]

  constructor(initialItems?: T[]) {
    this.currentItems = initialItems ? [...initialItems] : []
    this.initial = initialItems ? [...initialItems] : []
    this.newItems = []
    this.removedItems = []
  }

  abstract compareItems(a: T, b: T): boolean

  getItems(): T[] {
    return this.currentItems
  }

  getNewItems(): T[] {
    return this.newItems
  }

  getRemovedItems(): T[] {
    return this.removedItems
  }

  exists(item: T): boolean {
    return this.currentItems.some((current) => this.compareItems(current, item))
  }

  add(item: T): void {
    if (this.isRemovedItem(item)) {
      this.removedItems = this.removedItems.filter(
        (removed) => !this.compareItems(removed, item),
      )
    }
    if (!this.isNewItem(item) && !this.wasInitialItem(item)) {
      this.newItems.push(item)
    }
    if (!this.exists(item)) {
      this.currentItems.push(item)
    }
  }

  remove(item: T): void {
    this.currentItems = this.currentItems.filter(
      (current) => !this.compareItems(current, item),
    )
    if (this.isNewItem(item)) {
      this.newItems = this.newItems.filter(
        (newItem) => !this.compareItems(newItem, item),
      )
      return
    }
    if (!this.isRemovedItem(item)) {
      this.removedItems.push(item)
    }
  }

  update(item: T): void {
    const index = this.currentItems.findIndex((current) =>
      this.compareItems(current, item),
    )
    if (index !== -1) {
      this.currentItems[index] = item
    }
  }

  private isNewItem(item: T): boolean {
    return this.newItems.some((newItem) => this.compareItems(newItem, item))
  }

  private isRemovedItem(item: T): boolean {
    return this.removedItems.some((removed) => this.compareItems(removed, item))
  }

  private wasInitialItem(item: T): boolean {
    return this.initial.some((initial) => this.compareItems(initial, item))
  }
}
