'use strict'
window.addEventListener('DOMContentLoaded', () => {
	const inputTitle = document.querySelector('#title'),
		inputAuthor = document.querySelector('#author'),
		inputYear = document.querySelector('#year'),
		inputCover = document.querySelector('#cover'),
		inputForm = document.querySelector('#bookForm'),
		bookList = document.querySelector('#bookList'),
		sortSelect = document.querySelector('#sortBooks')

	class Book {
		constructor(title, author, year, cover) {
			this.id = Date.now() // unikal ID
			this.title = title
			this.author = author
			this.year = Number(year)
			this.cover = cover
			this.coverURL = URL.createObjectURL(cover) // blob URL
		}
	}

	class Library {
		constructor() {
			this.books = []
		}

		// yangi kitobni qo‘shish
		addBook(book) {
			this.books.push(book)
			this.renderBook(book)
		}

		// bitta kitob elementini yaratish
		renderBook(book) {
			const li = document.createElement('li')
			li.className =
				'group bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-shadow duration-300'
			li.dataset.id = book.id

			const img = document.createElement('img')
			img.src = book.coverURL
			img.alt = `Kitob rasmi: ${book.title}`
			img.loading = 'lazy'
			img.width = 400
			img.height = 400
			img.className = 'w-full h-56 sm:h-64 md:h-72 object-cover'

			const div = document.createElement('div')
			div.className = 'p-4 relative'

			const h3 = document.createElement('h3')
			h3.className = 'text-lg font-semibold mb-1 leading-tight'
			h3.textContent = book.title

			const yearP = document.createElement('p')
			yearP.className = 'text-sm text-gray-500 dark:text-gray-400 mb-2'
			yearP.textContent = `Yili: ${book.year}`

			const authorP = document.createElement('p')
			authorP.className = 'text-sm'
			authorP.textContent = `Muallif: ${book.author}`

			const delBtn = document.createElement('button')
			delBtn.className =
				'absolute bottom-3 right-3 text-2xl text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 deleteBtn'
			delBtn.ariaLabel = 'Kitobni o‘chirish'
			delBtn.title = 'O‘chirish'
			delBtn.dataset.id = book.id
			delBtn.textContent = '🗑️'

			div.append(h3, yearP, authorP, delBtn)
			li.append(img, div)
			bookList.append(li)
		}

		// kitobni o‘chirish
		removeBook(id) {
			const li = bookList.querySelector(`[data-id="${id}"]`)
			if (li) li.remove()

			const bookToRemove = this.books.find(book => book.id === id)
			if (bookToRemove) URL.revokeObjectURL(bookToRemove.coverURL) // to‘g‘ri tozalash

			this.books = this.books.filter(book => book.id !== id)
		}

		// sort funksiyasi
		sortBooks(type) {
			if (type === 'year-asc') this.books.sort((a, b) => a.year - b.year)
			else if (type === 'year-desc') this.books.sort((a, b) => b.year - a.year)
			else if (type === 'title-asc')
				this.books.sort((a, b) => a.title.localeCompare(b.title))
			else if (type === 'author-asc')
				this.books.sort((a, b) => a.author.localeCompare(b.author))

			// sortdan keyin DOMni yangilash
			bookList.innerHTML = ''
			this.books.forEach(book => this.renderBook(book))
		}
	}

	const library = new Library()

	// Form submit
	inputForm.addEventListener('submit', e => {
		e.preventDefault()
		const bookTitle = inputTitle.value.trim(),
			bookAuthor = inputAuthor.value.trim(),
			bookYear = inputYear.value,
			bookCover = inputCover.files[0]

		if (!bookTitle || !bookAuthor || !bookYear || !bookCover) return

		const newBook = new Book(bookTitle, bookAuthor, bookYear, bookCover)
		library.addBook(newBook)
		inputForm.reset()
	})

	// Sort
	sortSelect.addEventListener('change', e => {
		const type = e.target.value
		library.sortBooks(type)
	})

	// Event delegation (o‘chirish)
	bookList.addEventListener('click', e => {
		const deleteBtn = e.target.closest('.deleteBtn')
		if (deleteBtn) {
			const id = Number(deleteBtn.dataset.id)
			library.removeBook(id)
		}
	})
})
