import { useState, useEffect } from 'react'
import axios from 'axios'
import NewsCard from './NewsCard'
import ReactPaginate from 'react-paginate'



 const NewsPage = () => {
    const [currentPage, setCurrentPage] = useState(0)
    const [articles, setArticles] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(0)
    const [query, setQuery] = useState("")
    const [searchImput, setSearchImput] = useState("")

    const handlePageChange = e => {
        console.log(e)
        setCurrentPage(e.selected)        
    }

    const handelSubmit = e => {
        e.preventDefault()
        setCurrentPage(0)
        setQuery(searchImput)
    }

    useEffect(() => {
        setIsLoading(true)
        const fetchData = async() => {
            try{
                const { data } = await axios.get("https://hn.algolia.com/api/v1/search?", 
                {
                    params: { page : currentPage, query },
                })
                const { hits, nbPages } = data
                setArticles(hits) 
                setTotalPages(nbPages)
                console.log(data)
            } catch (err) {
                console.log(err)
            }finally{
                setIsLoading(false)
            }
        }
        fetchData()
    }, [currentPage, query])
    return(
        <div className='container'>
            <h1>HACKER NEWS</h1>
            <form className='search-form' onSubmit={handelSubmit}>
                <input 
                    placeholder='News finder'
                    value={searchImput}
                    onChange={e => setSearchImput(e.target.value)}
                />
                <button type='submit'>Search</button>
            </form>
            <div className='news-container'>
                { isLoading ? (<p>Loading...</p>) : (articles.map(( article ) => (
                        <NewsCard article = { article } key = { article.ID } />
                        ))
                )}
            </div>
            <ReactPaginate 
                nextLabel="=>"
                previousLabel="<="
                breakLabel="..."
                forcePage={currentPage}
                pageCount={totalPages}
                renderOnZeroPageCount={null}
                onPageChange={handlePageChange}
                className="pagination"
                activeClassName="active-page"
                previousClassName='previous-page'
                nextClassName='next-page'

            />
        </div>
    )
 }

 export default NewsPage