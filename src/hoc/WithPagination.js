import React, { Component } from "react";
import axios from "axios";

const getDisplayName = WrappedComponent => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
};

const withPagination = WrappedComponent => {
  class WithPagination extends Component {
    state = {
      siteList: [],
      totalCount: 0,
      toData: 200,
      fromData: 1,
      pageNum: 1,
      dLoader: true,
      per_page: 200,
      totalPage: null,
      textVal: null,
      form_id_string: ""
    };

    getUrl = (page_num, payload) => {
      switch (payload.type) {
        case "projectSiteList":
          return `fv3/api/project-site-list/?page=${page_num}&project=${payload.projectId}`;
        case "mySiteList":
          return `fv3/api/my-sites/?page=${page_num}&project=${payload.projectId}`;

        case "regionSite":
          return `fv3/api/regional-sites/?page=${page_num}&region=${payload.projectId}`;

        case "projectRegionList":
          return `fv3/api/project-regions/?page=${page_num}&project=${payload.projectId}`;

        case "viewByStatus":
          return `fv3/api/view-by-status/?page=${page_num}&project=${payload.projectId}&submission_status=${payload.status}`;
        case "siteStatus":
          return `fv3/api/view-by-status/?page=${page_num}&site=${payload.projectId}&submission_status=${payload.status}`;
        case "formSubmission":
          return `/fv3/api/forms-submissions/?page=${page_num}&project=${payload.projectId}&fsxf_id=${payload.fsxf_id}`;
        case "siteSubmission":
          return `/fv3/api/forms-submissions/?page=${page_num}&site=${payload.projectId}&fsxf_id=${payload.fsxf_id}`;
      }
    };

    requestHandler = paginateUrl => {
      this._isMounted = true;
      axios
        .get(`${paginateUrl}`)

        .then(res => {
          if (this._isMounted) {
            if (res.status === 200) {
              // if (res.data.results.query === null) {
              //   this.setState({
              //     siteList: res.data.results.data,
              //     dLoader: false,
              //     totalCount: res.data.count,
              //     textVal: null,
              //     totalPage: Math.ceil(res.data.count / 200)
              //   });
              // } else {
              //   if (res.data.results.query == this.state.textVal) {
              //     this.setState({
              //       siteList: res.data.results.data,
              //       dLoader: false,
              //       totalCount: res.data.count,
              //       textVal: null,
              //       totalPage: Math.ceil(res.data.count / 200)
              //     });
              //   }
              //}

              if (res.data.results.query) {
                if (res.data.results.query == this.state.textVal) {
                  this.setState({
                    siteList: res.data.results.data,
                    dLoader: false,
                    totalCount: res.data.count,
                    textVal: null,
                    totalPage: Math.ceil(res.data.count / 200)
                  });
                }
              } else {
                this.setState({
                  siteList: res.data.results.data,
                  dLoader: false,
                  totalCount: res.data.count,
                  textVal: null,
                  form_id_string: res.data.results.form_id_string,
                  breadcrumbs: res.data.results.breadcrumbs,
                  totalPage: Math.ceil(res.data.count / 200)
                });
              }
            }
          }
        })
        .catch(err => {});
    };

    paginationHandler = (page_num, searchUrl, payload) => {
      const toNum = page_num * 200;
      const fromNum = (page_num - 1) * 200 + 1;
      let paginateUrl;

      if (searchUrl) {
        paginateUrl = searchUrl;
      } else {
        paginateUrl = this.getUrl(page_num, payload);
      }
      this.setState(
        {
          toData: toNum,
          fromData: fromNum,
          pageNum: page_num,
          dLoader: true
        },
        () => this.requestHandler(paginateUrl)
      );
    };

    renderPageNumbers = payload => {
      if (this.state.totalPage) {
        const pageNumbers = [];
        for (let i = 1; i <= this.state.totalPage; i++) {
          pageNumbers.push(i);
        }

        return pageNumbers.map(number => {
          let classes = this.state.pageNum === number ? "current" : "";

          if (
            number == 1 ||
            number == this.state.totalPage ||
            (number >= this.state.pageNum - 2 &&
              number <= this.state.pageNum + 2)
          ) {
            return (
              <li key={number} className={classes}>
                <a onClick={e => this.paginationHandler(number, null, payload)}>
                  {number}
                </a>
              </li>
            );
          }
        });
      }
    };

    searchHandler = (searchValue, searchUrl, payload) => {
      if (searchValue) {
        this.setState({
          textVal: searchValue
        });
        this.paginationHandler(1, searchUrl, payload);
      } else {
        this.setState({
          pageNum: 1,
          textVal: null
        });
        this.paginationHandler(1, null, payload);
      }
    };

    render() {
      const {
        state,
        searchHandler,
        renderPageNumbers,
        paginationHandler,
        requestHandler
      } = this;
      return (
        <WrappedComponent
          {...this.props}
          {...state}
          searchHandler={searchHandler}
          renderPageNumbers={renderPageNumbers}
          paginationHandler={paginationHandler}
          requestHandler={requestHandler}
        />
      );
    }

    componentWillUnmount() {
      this._isMounted = false;
    }
  }

  WithPagination.displayName = `WithPagination(${getDisplayName(
    WrappedComponent
  )})`;

  return WithPagination;
};

export default withPagination;
