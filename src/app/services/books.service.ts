import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { GutendexListResponse, Book } from '@app/models';

@Injectable({
	providedIn: 'root',
})
export class BooksService {
	private http = inject(HttpClient);
	private apiUrl = 'https://gutendex.com';

	public state = signal({
		books: new Map<number, Book>(),
	});

	constructor() {
		this.getBooks();
	}

	getIterableBooks() {
		return Array.from(this.state().books.values());
	}

	getBooks(page?: number): void {
		this.http
			.get<GutendexListResponse>(`${this.apiUrl}/books${page ? `?page=${page}` : ''}`)
			.subscribe((response: GutendexListResponse) => {
				response.results.forEach((book: Book) => {
					this.state().books.set(book.id, book);
				});
				this.state.set({ books: this.state().books });
			});
	}
}
