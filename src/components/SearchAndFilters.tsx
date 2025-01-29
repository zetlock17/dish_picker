import '../styles/components/search-and-filters.scss';

interface SearchAndFiltersProps {
    
}
 
const SearchAndFilters: React.FC<SearchAndFiltersProps> = () => {
    return (
        <div className="search-and-filters">
            <div>Поиск</div>
            <div>Фильтр по компонентам</div>
            <div>Другие фильры</div>
        </div>
    );
}
 
export default SearchAndFilters;