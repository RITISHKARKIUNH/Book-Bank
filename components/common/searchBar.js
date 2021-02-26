import { useState } from 'react';
function SearchBar() {
    const [query, setSearchQuery] = useState('');
    const [searchFocused, setSearchFoucsed] = useState(false);
    return (
        <div style={{width:"400px"}} className={`form-group mb-0 ${searchFocused ? 'focused' : ''}`}>
            <div className="input-group input-group-merge">
                <div className="input-group-prepend">
                    <span className="input-group-text"><i className="fas fa-search"></i></span>
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFoucsed(true)}
                    onBlur={() => setSearchFoucsed(false)}
                    className="form-control"
                    id="input-email"
                    placeholder="Search Books"
                />
            </div>
        </div>
    );
}
export default SearchBar;