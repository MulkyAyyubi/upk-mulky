import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";

const TABS = ["All Books"];
const API_BASE = "http://localhost:3000";

export default function BookKingdom() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("All Books");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);

  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // ADD MODAL STATE
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${API_BASE}/books`);
        setBooks(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchTab = activeTab === "All Books" || b.category === activeTab;
      const matchQuery = b.title.toLowerCase().includes(query.toLowerCase());
      return matchTab && matchQuery;
    });
  }, [books, activeTab, query]);

  const openEdit = (book) => {
    setSelectedBook({ ...book });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!selectedBook) return;

    const bookToUpdate = {
      title: selectedBook.title,
      author: selectedBook.author,
      category: selectedBook.category,
      description: selectedBook.description,
      price:
        selectedBook.price === "" || selectedBook.price === undefined
          ? undefined
          : Number(selectedBook.price),
    };

    try {
      const response = await axios.put(
        `${API_BASE}/books/${selectedBook.id}`,
        bookToUpdate,
      );
      const updatedBook = response.data.data;
      const normalizedId = Number(updatedBook.id);
      setBooks((prev) =>
        prev.map((b) =>
          b.id === normalizedId ? { ...updatedBook, id: normalizedId } : b,
        ),
      );
      setSelectedBook({ ...updatedBook, id: normalizedId });
      setShowModal(false);
    } catch (err) {
      console.error(err.response?.data || err);
      alert(
        err.response?.data?.message ||
          "Failed to update book. Check console for details.",
      );
    }
  };

  const handleCreate = async () => {
    if (
      !newBook.title ||
      !newBook.category ||
      !newBook.author ||
      !newBook.description
    ) {
      alert("Please complete all fields before saving.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/books`, {
        title: newBook.title,
        author: newBook.author,
        category: newBook.category,
        description: newBook.description,
        price: Number(newBook.price) || 0,
      });

      setBooks((prev) => [...prev, response.data.data]);
      setNewBook({
        title: "",
        author: "",
        category: "",
        description: "",
        price: "",
      });
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create book");
    }
  };

  const addToCart = (book) => {
    setCart((prev) => [...prev, book]);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0,
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      {/* Navbar */}
      <header className="flex items-center justify-between px-4 md:px-10 py-4 bg-gray-800 shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-lg">
          📘 <span>Book Kingdom</span>
        </div>
        <button
          onClick={() => setShowCart(true)}
          className="text-sm md:text-base"
        >
          🛒 Cart ({cart.length})
        </button>
      </header>

      {/* Hero */}
      <section className="bg-linear-to-r from-cyan-600 to-cyan-500 text-white text-center py-16 md:py-24 px-4">
        <h1 className="text-2xl md:text-5xl font-bold mb-4">
          Welcome to Book Kingdom
        </h1>
        <p className="text-sm md:text-lg opacity-90">
          Discover novels, comics, and study books — all in one place.
        </p>
      </section>

      {/* Filters */}
      <section className="px-4 md:px-10 py-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm ${
                activeTab === tab
                  ? "bg-cyan-500 text-white"
                  : "bg-gray-700 border border-gray-600 text-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books..."
          className="px-4 py-2 border border-gray-600 rounded-lg w-full md:w-64 bg-gray-700 text-gray-100 placeholder-gray-400"
        />
      </section>

      {/* Grid */}
      <div className="px-4 md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((book) => (
          <div
            key={book.id}
            onClick={() => openEdit(book)}
            className="bg-gray-800 p-4 rounded-xl shadow cursor-pointer transition-all duration-400 hover:shadow-xl hover:-translate-y-3 "
          >
            <div className="h-32 bg-gray-700 rounded mb-3 flex items-center justify-center">
              📚
            </div>
            <h3 className="font-bold text-lg text-gray-100">{book.title}</h3>
            <p className="text-gray-400 mb-2 text-sm">{book.author}</p>
            <p className="text-sm pb-5 text-gray-300">{book.description}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(book);
              }}
              className="w-full bg-cyan-500 text-white py-1 rounded text-sm cursor-pointer"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showModal && selectedBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-200 h-120">
            <h2 className="font-bold mt-7 mb-4 text-gray-100">Edit Book</h2>
            <div className="grid gap-3">
              <input
                value={selectedBook.title}
                onChange={(e) =>
                  setSelectedBook({ ...selectedBook, title: e.target.value })
                }
                placeholder="Book Title"
                className="w-full border border-gray-600 px-3 py-2 rounded bg-gray-700 text-gray-100 placeholder-gray-400"
              />
              <input
                value={selectedBook.author}
                onChange={(e) =>
                  setSelectedBook({ ...selectedBook, author: e.target.value })
                }
                placeholder="Author"
                className="w-full border border-gray-600 px-3 py-2 rounded bg-gray-700 text-gray-100 placeholder-gray-400"
              />
              <input
                value={selectedBook.category}
                onChange={(e) =>
                  setSelectedBook({ ...selectedBook, category: e.target.value })
                }
                placeholder="Category"
                className="w-full border border-gray-600 px-3 py-2 rounded bg-gray-700 text-gray-100 placeholder-gray-400"
              />
              <input
                type="number"
                value={selectedBook.price}
                onChange={(e) =>
                  setSelectedBook({
                    ...selectedBook,
                    price: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                placeholder="Price"
                className="w-full border border-gray-600 px-3 py-2 rounded bg-gray-700 text-gray-100 placeholder-gray-400"
              />
              <textarea
                value={selectedBook.description}
                onChange={(e) =>
                  setSelectedBook({
                    ...selectedBook,
                    description: e.target.value,
                  })
                }
                placeholder="Description"
                className="w-full border border-gray-600 px-3 py-2 rounded h-28 bg-gray-700 text-gray-100 placeholder-gray-400"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-300 hover:text-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (confirm("Are you sure you want to delete this book?")) {
                    try {
                      await axios.delete(
                        `${API_BASE}/books/${selectedBook.id}`,
                      );
                      setBooks((prev) =>
                        prev.filter((b) => b.id !== selectedBook.id),
                      );
                      setShowModal(false);
                    } catch (err) {
                      console.error(err);
                      alert("Failed to delete book");
                    }
                  }
                }}
                className="bg-red-600 text-white px-4 py-1 rounded cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={handleSave}
                className="bg-cyan-500 text-white px-4 py-1 rounded cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-gray-800 w-full max-w-md h-full p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-lg text-gray-100">Your Cart</h2>
                <p className="text-sm text-gray-400">{cart.length} item(s)</p>
              </div>
              <button
                onClick={() => setShowCart(false)}
                className="text-xl text-gray-300"
              >
                ✖
              </button>
            </div>
            {cart.length === 0 ? (
              <p className="text-sm text-gray-400">Cart is empty</p>
            ) : (
              <ul className="space-y-4">
                {cart.map((item, i) => (
                  <li
                    key={i}
                    className="border border-gray-600 rounded-xl p-4 bg-gray-700"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-semibold text-gray-100">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-400">{item.author}</p>
                        <p className="text-sm text-gray-400">{item.category}</p>
                        <p className="mt-2 text-sm font-semibold text-cyan-400">
                          ${Number(item.price || 0).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(i)}
                        className="text-red-500 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {cart.length > 0 && (
              <div className="mt-6 border-t border-gray-600 pt-4">
                <p className="text-sm text-gray-300">Total</p>
                <p className="text-xl font-bold text-gray-100">
                  ${cartTotal.toFixed(2)}
                </p>
                <button className="mt-4 w-full bg-cyan-500 text-white py-3 rounded-lg">
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="bg-gray-800 p-7 rounded-xl w-full max-w-lg">
            <h2 className="font-bold mb-4 text-gray-100">Add New Book</h2>
            <div className="grid gap-3">
              <input
                value={newBook.title}
                onChange={(e) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
                placeholder="Book Title"
                className="w-full border border-gray-600 px-3 py-2 rounded bg-gray-700 text-gray-100 placeholder-gray-400"
              />
              <input
                value={newBook.author}
                onChange={(e) =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
                placeholder="Author"
                className="w-full border border-gray-600 px-3 py-2 rounded bg-gray-700 text-gray-100 placeholder-gray-400"
              />
              <input
                value={newBook.category}
                onChange={(e) =>
                  setNewBook({ ...newBook, category: e.target.value })
                }
                placeholder="Category"
                className="w-full border border-gray-600 px-3 py-2 rounded bg-gray-700 text-gray-100 placeholder-gray-400"
              />
              <input
                type="number"
                value={newBook.price}
                onChange={(e) =>
                  setNewBook({
                    ...newBook,
                    price: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                placeholder="Price"
                className="w-full border border-gray-600 px-3 py-2 rounded bg-gray-700 text-gray-100 placeholder-gray-400"
              />
              <textarea
                value={newBook.description}
                onChange={(e) =>
                  setNewBook({ ...newBook, description: e.target.value })
                }
                placeholder="Description"
                className="w-full border border-gray-600 px-3 py-2 rounded h-28 bg-gray-700 text-gray-100 placeholder-gray-400"
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-300 hover:text-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="bg-cyan-500 text-white px-4 py-2 rounded cursor-pointer"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setShowAddModal(true)}
        aria-label="Add new book"
        title="Add new book"
        className="fixed bottom-6 right-6 bg-cyan-500 text-white w-14 h-14 rounded-full text-2xl shadow-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 cursor-pointer"
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}
