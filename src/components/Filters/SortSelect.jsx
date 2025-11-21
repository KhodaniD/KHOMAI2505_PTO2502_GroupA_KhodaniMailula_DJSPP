import React, { useContext } from "react";
import { FaAngleDown } from "react-icons/fa";
import styles from "./SortSelect.module.css";
import { PodcastContext } from "../../context/PodcastContext.jsx";

/**
 * Renders a dropdown select element for sorting the podcast list.
 * Reads and updates the global sort state in PodcastContext.
 */
export default function SortSelect() {
  // Destructure current sort state and setter from global context
  const { sort, setSort } = useContext(PodcastContext);

  const handleChange = (e) => {
    // Update the global sort state with the selected option value
    setSort(e.target.value);
  };

  return (
    <div className={styles.sortFilter}>
      <select
        value={sort}
        onChange={handleChange}
        className={styles.sortSelect}
        id="sortSelect"
      >
        <option value="updated_desc">Newest</option>
        <option value="updated_asc">Oldest</option>
        <option value="title_asc">A-Z</option>
        <option value="title_desc">Z-A</option>
      </select>
      
      {/* Custom Arrow Icon for consistent styling */}
      <FaAngleDown className={styles.arrowIcon} />
    </div>
  );
}