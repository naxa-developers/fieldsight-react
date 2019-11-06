import React, { Component, Fragment } from "react";
// export const LanguageContext = React.createContext();

// const languageOption = []
// class LaguageProvider extends Component{
//     state={language : 'en'}

//     onChangeHandler = (e) => {
// const {value} = e.target;
// this.setState({
//     language: value
// })
//     }
//     render() {
//         const {state, onChangeHandler } = this
//         return(
//         <Fragment>
//             <LanguageContext.Provider
//             value={{
//                 ...state,
//                 onChangeHandler
//             }}
//             >
//             {this.props.children}
//             </LanguageContext.Provider>
//       </Fragment>
//         )
//     }
// }

// const LanguageConsumer = LanguageContext.Consumer;

// export { LaguageProvider, LanguageConsumer };

export const language = {
  en: "en",
  ne: "ne"
};

export const LanguageContext = React.createContext(
  language.en // default value
);
