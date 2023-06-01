import React, { useEffect, useMemo, useState } from 'react';

const Item = ({ name, category }) => (
  <div className="item-container">
    <div>
      <span className="item-label">Name:</span>
      {name}
    </div>
    <div>
      <span className="item-label">Category:</span>
      {category}
    </div>
  </div>
);

//Filter list by category in React JS
export default function App() {
  // Default Value === data?.data
  var defaultSports = [
    { name: 'Table Tennis', category: 'Indoor' },
    { name: 'Football', category: 'Outdoor' },
    { name: 'Swimming', category: 'Aquatics' },
    { name: 'Chess', category: 'Indoor' },
    { name: 'BaseBall', category: 'Outdoor' },
  ];

  // const [filterList, setFilterList] = useState([]);
  const [sportList, setSportList] = useState([]);

  // const [selectedStatus, setSelectedStatus] = useState();
  const [selectedCategory, setSelectedCategory] = useState();

  // Add default value on page load
  useEffect(() => {
    // setFilterList(data?.data);
    setSportList(defaultSports);
  }, []);

  // Function to get filtered list
  function getFilteredList() {
    // Avoid filter when selectedCategory is null
    // if (!selectedStatus) { return filterList; }
    if (!selectedCategory) {
      return sportList;
    }
    // return filterList.filter((item) => item.status === selectedStatus);
    console.log('sportList', sportList, selectedCategory);
    return sportList.filter((item) => item.category === selectedCategory);
  }

  // Avoid duplicate function calls with useMemo
  // const res = useMemo(getFilterList, [selectedStatus, filterList]);
  const filteredList = useMemo(getFilteredList, [selectedCategory, sportList]);
  console.log('filteredList', filteredList);

  function handleCategoryChange(event) {
    setSelectedCategory(event.target.value);
  }

  return (
    <div className="app">
      <div className="filter-container">
        <div>Filter by Category:</div>
        <div>
          <select
            name="category-list"
            id="category-list"
            onChange={handleCategoryChange}
          >
            <option value="">All</option>
            <option value="Outdoor">Outdoor</option>
            <option value="Indoor">Indoor</option>
            <option value="Aquatics">Aquatics</option>
          </select>
        </div>
      </div>
      <div className="sport-list">
        {filteredList.map((element, index) => (
          <Item {...element} key={index} />
        ))}
      </div>
    </div>
  );
}
