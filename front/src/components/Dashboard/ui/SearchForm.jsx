import React from 'react';
import {
    Form,
    InputGroup
} from "react-bootstrap";
import { Search } from 'react-bootstrap-icons';


function SearchForm({
    searchTerm, setSearchTerm
}) {
    return (
    <Form className="w-100 mb-3">
      <InputGroup>
        <Form.Control 
            type="text" 
            placeholder="Search" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <InputGroup.Text className="search-button">
            <Search />
        </InputGroup.Text>
      </InputGroup>
    </Form>
    )
}

export default React.memo(SearchForm);