import DishList from './DishList';
import GoalPresenter from './GoalPresenter';
import SearchAndFilters from './SearchAndFilters';

interface MainPageProps {
    
}
 
const MainPage: React.FC<MainPageProps> = () => {
    return (
        <div>
            <GoalPresenter />
            <SearchAndFilters />
            <DishList />
        </div>
    );
}
 
export default MainPage;