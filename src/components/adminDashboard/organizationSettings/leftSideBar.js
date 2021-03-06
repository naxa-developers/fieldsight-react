import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

export default class LeftSideBar extends PureComponent {
  leftsideNavRoute = props => {
    const {
      location: { pathname },
      match: {
        url,
        params: { id },
      },
    } = props;

    const navRoute = [
      {
        id: '1',
        to: `${url}`,
        path: `${url}/${id}`,
        title: 'Organization Information',
      },
      {
        id: '2',
        to: `${url}/teams`,
        path: `${url}/teams`,
        title: 'Teams ',
      },
      {
        id: '3',
        to: `${url}/my-form`,
        path: `${url}/my-form`,
        title: 'Organization Default Forms',
      },
      {
        id: '4',
        to: `${url}/library`,
        path: `${url}/library`,
        title: 'Organization Library Forms',
      },
    ];

    return navRoute.map(route => (
      <li className="nav-item" key={route.id}>
        <Link
          to={route.to}
          className={
            pathname === route.path ? 'nav-link active' : 'nav-link'
          }
        >
          {route.title}
        </Link>
      </li>
    ));
  };

  render() {
    return (
      <ul className="nav nav-tabs flex-column border-tabs">
        {this.leftsideNavRoute(this.props.pathname)}
      </ul>
    );
  }
}
