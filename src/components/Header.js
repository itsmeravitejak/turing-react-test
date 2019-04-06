import React, { Component } from 'react';
import { connect } from 'react-redux';
import CartWidget from './CartWidget';
import { Link } from '../routes';
import { ToastContainer } from "react-toastify";

import Loader from './Loader';
class Header extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      search_term: null,
      search_started: false
    }

  }

  componentDidMount() {
    this.props.getAllDepartments();
  }

  onDepartmentChange = (departmentId) => {
    return this.props.onDepartmentChange(departmentId)
  }

  logout = () => {
    const token = localStorage.removeItem('token');
  }

  onSearchChange = (e) => {
    const term = e.target.value
    if (term.length > 3) {
      this.setState({
        search_started: true
      })
      this.props.searchProduct(term)
    }
  }

  clear = () => {
    this.setState({
      search_started: false,
      search_term: ''
    })
  }

  render() {
    const { search_term, searchResults = [], departments, searchProduct } = this.props;
    const { search_started } = this.state;
    return (
      <div className="header">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-7 d-flex align-items-center justify-content-between">
              <div className="">
                <div className="brand">
                  <Link to="/"><a href="/">SHOPMATE</a></Link>
                </div>
              </div>
              <div className=" header-sections">
                <ul className="header-items">
                  <li>
                    <button onClick={() => this.onDepartmentChange()}>All</button>
                  </li>
                </ul>
                {departments && departments.map((department, i) => {
                  return (<ul className="header-items" key={`department-${i}`}>
                    <li>
                      <button onClick={() => this.onDepartmentChange(department.department_id)}>{department.name}</button>
                    </li>
                  </ul>)
                })}
              </div>
            </div>
            <div className="col-4">
              {<div className="search-icon" onClick={() => this.clear()}>
                <img src="/static/close.png" />
              </div>}
              <input name="search" defaultValue={search_term} type="text" className="form-control" placeholder="Search" autoComplete="off" onChange={this.onSearchChange} />

              {search_started && <div className="search-results">
                {searchResults.length === 0 &&<Loader />}
                  {searchResults.length >= 1 && searchResults.map((product) => {
                    return (
                      <div className="search-item">
                      <Link to={`/product/${product.product_id}`}><a href={`/product/${product.product_id}`}>{product.name}</a></Link>
                      </div>
                    )
                  })}
              </div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    departments: state.department.departments,
    searchResults: state.product.searchResults.rows
  };
}

const mapDispatchToProps = (dispatch) => {
  return ({
    getAllDepartments: () => dispatch({ type: 'GET_ALL_DEPARTMENTS' }),
    onDepartmentChange: (departmentId) => {
      return dispatch({ type: 'SET_CURRENT_DEPARTMENT', departmentId })
    },
    searchProduct: (term) => {
      return dispatch({ type: 'SEARCH_PRODUCT', term })
    },
    resetSearch: () => ({ type: 'RESET_SEARCH' })
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
