import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import uuid from "uuid/v4";
import { BlockContentLoader } from "../../common/Loader";

const DashboardInfoItem = ({ meta, siteKey }) => (
  <li>
    <p>
      <label>{siteKey} :</label> {meta}
    </p>
  </li>
);
const Array = ({ siteMetas, showContentLoader }) => {
  return (
    <>
      {showContentLoader ? (
        <BlockContentLoader number={16} height="15px" />
      ) : (
        <PerfectScrollbar>
          <div className="info-wrap">
            <ul>
              {console.log(siteMetas, "siteMetas")}
              {Object.entries(siteMetas).map(meta => {
                if (meta[0] == "From_Another_Project") {
                  const data =
                    meta[1].children && Object.entries(meta[1].children);

                  return (
                    data &&
                    data.map((items, i) => (
                      <>
                        <DashboardInfoItem
                          meta={items[1]}
                          siteKey={items[0]}
                          key={uuid()}
                        />
                      </>
                    ))
                  );
                } else {
                  return (
                    <DashboardInfoItem
                      meta={meta[1]}
                      siteKey={meta[0]}
                      key={uuid()}
                    />
                  );
                }
              })}
            </ul>
          </div>
        </PerfectScrollbar>
      )}
    </>
  );
};

const DashboardInfo = ({ siteMetas, showContentLoader }) => (
  <>
    <Array siteMetas={siteMetas} showContentLoader={showContentLoader} />
    {/*showContentLoader ? (
      <BlockContentLoader number={16} height="15px" />
    ) : (
      <PerfectScrollbar>
        <div className="info-wrap">
          <ul>
            {//Object.keys(siteMetas).length > 0 ? (
            Object.keys(siteMetas).map(meta => (
              <DashboardInfoItem meta={meta} key={uuid()} />
            ))}
          </ul>
        </div>
      </PerfectScrollbar>
            )*/}
  </>
);
export default DashboardInfo;
