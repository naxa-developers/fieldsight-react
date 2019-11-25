import React, { Component } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import { FormattedMessage, injectIntl } from 'react-intl';
import uuid from 'uuid/v4';
import { BlockContentLoader } from './Loader';

class Logs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: false,
    };
  }

  getLog = (data, user_id) => {
    let content = '';
    const formdetail = data.get_event_name.split('form');

    switch (data.type) {
      case 0:
        content =
          '<b><a href="' +
          data.get_source_url +
          '">' +
          data.source_name +
          '</a></b> joined <b><a href="' +
          data.get_event_url +
          '">' +
          data.event_name +
          '</a></b> as an Team Admin.';
        return content;
      case 1:
        content =
          '<b><a href="' +
          data.get_source_url +
          '">' +
          data.source_name +
          '</a></b> joined <b><a href="' +
          data.get_event_url +
          '">' +
          data.get_event_name +
          '</a></b> as an Team Admin.';
        return content;
      case 2:
        content =
          '<b><a href="' +
          data.get_source_url +
          '">' +
          data.source_name +
          '</a></b> was added as the Project Manager of <b><a href="' +
          data.get_event_url +
          '">' +
          data.get_event_name +
          '</a></b> by <b><a href="' +
          data.get_extraobj_url +
          '">' +
          data.get_extraobj_name +
          '</a></b>.';
        return content;
      case 3:
        if (data.terms_and_labels != null) {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was added as ' +
            data.terms_and_labels.site_reviewer +
            ' of <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> by <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        } else {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was added as Reviewer of <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> by <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        }
        return content;

      case 4:
        if (data.terms_and_labels != null) {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was added as ' +
            data.terms_and_labels.site_supervisor +
            ' of <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> by <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        } else {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was added as Site Supervisor of <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> by <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        }
        return content;
      case 5:
        content =
          '<b><a href="' +
          data.get_source_url +
          '">' +
          data.source_name +
          '</a></b> was assigned as an Team Admin in <b><a href="' +
          data.get_event_url +
          '">' +
          data.get_event_name +
          '</a></b>.';
        return content;
      case 6:
        content =
          '<b><a href="' +
          data.get_source_url +
          '">' +
          data.source_name +
          '</a></b> was assigned as a Project Manager in <b><a href="' +
          data.get_event_url +
          '">' +
          data.get_event_name +
          '</a></b> by <b><a href="' +
          data.get_extraobj_url +
          '">' +
          data.get_extraobj_name +
          '</a></b>.';
        return content;
      case 7:
        if (data.terms_and_labels != null) {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was assigned as a ' +
            data.terms_and_labels.site_reviewer +
            ' in <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b>.';
        } else {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was assigned as a Reviewer in <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b>.';
        }
        return content;
      case 8:
        if (data.terms_and_labels != null) {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was assigned as a ' +
            data.terms_and_labels.site_supervisor +
            ' in <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b>.';
        } else {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was assigned as a Site Supervisor in <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b>.';
        }
        return content;

      case 9:
        content =
          '<b><a href="' +
          data.get_source_url +
          '">' +
          data.source_name +
          '</a></b> created a new Team named <b><a href="' +
          data.get_event_url +
          '">' +
          data.get_event_name +
          '</a></b>.';
        return content;

      case 10:
        content =
          '<b><a href="' +
          data.get_source_url +
          '">' +
          data.source_name +
          '</a></b> created a new project named <b><a href="' +
          data.get_event_url +
          '">' +
          data.get_event_name +
          '</a></b>.';
        return content;
      case 11:
        if (data.terms_and_labels != null) {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> created a new ' +
            data.terms_and_labels.site +
            ' named <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> in Project named <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        } else {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> created a new site named <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> in Project named <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        }
        return content;
      case 12:
        if (data.source_uid == user_id) {
          content =
            '<span style="color:green;"><b>Sucessfully</b></span> ' +
            data.extra_message +
            ' in project <a href="' +
            data.get_event_url +
            '"><b>' +
            data.get_event_name +
            '</a></b>.';
        } else {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> ' +
            data.extra_message +
            ' in <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b>.';
        }
        return content;
      case 13:
        content =
          '<b><a href="' +
          data.get_source_url +
          '">' +
          data.source_name +
          '</a></b> changed the details of Team named <b><a href="' +
          data.get_event_url +
          '">' +
          data.get_event_name +
          '</a></b>.';
        return content;
      case 14:
        content =
          '<b><a href="' +
          data.get_source_url +
          '">' +
          data.source_name +
          '</a></b> changed the details of project named <b><a href="' +
          data.get_event_url +
          '">' +
          data.get_event_name +
          '</a></b>.';
        return content;
      case 15:
        if (data.terms_and_labels != null) {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> changed the details of ' +
            data.terms_and_labels.site +
            ' named <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b>.';
        } else {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> changed the details of site named <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b>.';
        }

        return content;
      case 16:
        content =
          '<b><a href="' +
          data.get_source_url +
          '">' +
          data.source_name +
          '</a></b> submitted a response for ' +
          formdetail[0] +
          'form <b><a href="' +
          data.get_event_url +
          '">' +
          formdetail[1] +
          '</a></b>' +
          '</a></b> in <b><a href="' +
          data.get_extraobj_url +
          '">' +
          data.get_extraobj_name +
          '</a></b>.';
        return content;

      case 17:
        content =
          '<b><a href="' +
          data.get_source_url +
          '">' +
          data.source_name +
          '</a></b> reviewed a response for ' +
          formdetail[0] +
          'form <b><a href="' +
          data.get_event_url +
          '">' +
          formdetail[1] +
          '</a></b> in <b><a href="' +
          data.get_extraobj_url +
          '">' +
          data.get_extraobj_name +
          '</a></b>.';
        return content;
      case 18:
        content =
          '<b><a href="' +
          data.get_source_url +
          '">' +
          data.source_name +
          '</a></b> assigned a new ' +
          formdetail[0] +
          'form <b><a href="' +
          data.get_event_url +
          '">' +
          formdetail[1] +
          '</a></b> in project <b><a href="' +
          data.get_extraobj_url +
          '">' +
          data.get_extraobj_name +
          '</a></b>.';
        return content;
      case 19:
        content =
          '<b><a href="' +
          data.get_source_url +
          '">' +
          data.source_name +
          '</a></b> assigned a new ' +
          formdetail[0] +
          'form <b><a href="' +
          data.get_event_url +
          '">' +
          formdetail[1] +
          '</a></b> in site <b><a href="' +
          data.get_extraobj_url +
          '">' +
          data.get_extraobj_name +
          '</a></b>.';
        return content;
      case 20:
        content =
          '<b><a href="' +
          data.get_source_url +
          '">' +
          data.source_name +
          '</a></b> edited <b><a href="' +
          data.get_event_url +
          '">' +
          data.get_event_name +
          '</a></b> form.';
        return content;
      case 21:
        if (data.source_uid == user_id) {
          content =
            '<b>TASK INFO : </b>' +
            data.extra_message +
            ' of Team <a href="' +
            data.get_event_url +
            '"><b>' +
            data.get_event_name +
            '</a></b> were created.';
        } else {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> created ' +
            data.extra_message +
            ' of Team <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b>.';
        }
        return content;
      case 22:
        if (data.source_uid == user_id) {
          content =
            '<b>TASK INFO : </b>' +
            data.extra_message +
            ' of project <a href="' +
            data.get_event_url +
            '"><b>' +
            data.get_event_name +
            '</a></b> were created.';
        } else {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> created <b>' +
            data.extra_message +
            ' of project <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b>.';
        }
        return content;
      case 23:
        content =
          '<b>TASK INFO : </b>' +
          data.extra_message +
          ' in <a href="' +
          data.get_event_url +
          '"><b>' +
          data.get_event_name +
          '</a></b>.';
        return content;
      case 24:
        content =
          '<b><a href="' +
          data.get_source_url +
          '">' +
          data.source_name +
          '</a></b> was added in <b><a href="' +
          data.get_event_url +
          '">' +
          data.get_event_name +
          '</a></b> by <b><a href="' +
          data.get_extraobj_url +
          '">' +
          data.get_extraobj_name +
          '</a></b>.';
        return content;
      case 25:
        if (data.terms_and_labels != null) {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was added as <b>' +
            data.terms_and_labels.donor +
            '</b> of <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> by <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        } else {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was added as <b>Partner</b> of <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> by <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        }
        return content;
      case 26:
        content =
          '<b><a href="' +
          data.get_source_url +
          '">' +
          data.source_name +
          '</a></b> was added as the Project Manager in ' +
          data.extra_message +
          ' projects of <b><a href="' +
          data.get_event_url +
          '">' +
          data.get_event_name +
          '</a></b> by <b><a href="' +
          data.get_extraobj_url +
          '">' +
          data.get_extraobj_name +
          '</a></b>.';
        return content;
      case 27:
        if (data.terms_and_labels != null) {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was added as ' +
            data.terms_and_labels.site_reviewer +
            ' in ' +
            data.extra_message +
            ' sites of <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> by <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        } else {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was added as Reviewer in ' +
            data.extra_message +
            ' sites of <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> by <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        }
        return content;
      case 28:
        if (data.terms_and_labels != null) {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was added as ' +
            data.terms_and_labels.site_supervisor +
            ' ' +
            data.extra_message +
            ' sites of <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> by <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        } else {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was added as Site Supervisor in ' +
            data.extra_message +
            ' sites of <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> by <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        }
        return content;
      case 29:
        content =
          'Project Sites import from <a href="' +
          data.get_extraobj_url +
          '"><b>' +
          data.get_extraobj_name +
          '</a></b> has <span style="color:green;"><b>completed successfully</b></span> in project <a href="' +
          data.get_event_url +
          '"><b>' +
          data.get_event_name +
          '</a></b>.';
        return content;
      case 30:
        content =
          data.extra_message +
          '<a href="' +
          data.get_extraobj_url +
          '"><b>' +
          data.get_extraobj_name +
          '</a></b> has <span style="color:green;"><b>completed successfully</b></span> in project <a href="' +
          data.get_event_url +
          '"><b>' +
          data.get_event_name +
          '</a></b>.';
        return content;
      case 31:
        const level = 'site';
        if (data.extra_message == 'project') {
          level = 'project';
        }
        content =
          '<b><a href="' +
          data.get_source_url +
          '">' +
          data.source_name +
          '</a></b> edited a response in ' +
          formdetail[0] +
          'form <b><a href="' +
          data.get_event_url +
          '">' +
          formdetail[1] +
          '</a></b>' +
          '</a></b> in ' +
          level +
          ' <b><a href="' +
          data.get_extraobj_url +
          '">' +
          data.get_extraobj_name +
          '</a></b>.';
        return content;
      case 32:
        content =
          data.extra_message +
          ' <a href="' +
          data.get_extraobj_url +
          '"><b>' +
          data.get_extraobj_name +
          '</a></b></a></b> has <span style="color:green;"><b>successfully</b></span> been completed.';
        return content;
      case 33:
        content =
          '<b><a href="' +
          data.get_source_url +
          '">' +
          data.source_name +
          '</a></b> deleted a response submitted by ' +
          data.extra_json['submitted_by'] +
          ' in ' +
          formdetail[0] +
          'form <b><a href="' +
          data.get_event_url +
          '">' +
          formdetail[1] +
          '</a></b>' +
          '</a></b> in ' +
          data.extra_message +
          ' <b><a href="' +
          data.get_extraobj_url +
          '">' +
          data.get_extraobj_name +
          '</a></b>.';
        return content;
      case 34:
        content =
          '<b><a href="' +
          data.get_source_url +
          '">' +
          data.source_name +
          '</a></b> deleted ' +
          formdetail[1] +
          ' with ' +
          data.extra_json['submission_count'] +
          ' submissions in <b><a href="' +
          data.get_extraobj_url +
          '">' +
          data.get_extraobj_name +
          '</a></b>.';
        return content;
      case 35:
        if (data.source_uid == user_id) {
          content =
            '<span style="color:green;"><b>Sucessfully</b></span> ' +
            data.extra_message +
            ' of <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b>.';
        } else {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> ' +
            data.extra_message +
            ' of <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b>.';
        }
        return content;
      case 36:
        if (data.source_uid == user_id) {
          content =
            '<span style="color:green;"><b>Sucessfully</b></span> deleted ' +
            data.extra_message +
            ' named <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> of <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        } else {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> deleted ' +
            data.extra_message +
            ' named <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> of <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        }
        return content;
      case 37:
        if (data.terms_and_labels != null) {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was added as the ' +
            data.terms_and_labels.region_reviewer +
            ' in region <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> by <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        } else {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was added as the Region Reviewer in region <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> by <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        }
        return content;
      case 38:
        if (data.terms_and_labels != null) {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was added as the ' +
            data.terms_and_labels.region_supervisor +
            ' in <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> by <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        } else {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was added as the Region Supervisor in <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> by <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        }
        return content;

      case 39:
        if (data.terms_and_labels != null) {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was added as the ' +
            data.terms_and_labels.region_reviewer +
            ' in <b>' +
            data.extra_message +
            ' ' +
            data.terms_and_labels.region +
            '</b> of <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> by <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        } else {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was added as the Region Reviewer in <b>' +
            data.extra_message +
            ' Regions</b> of <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> by <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        }
        return content;
      case 40:
        if (data.terms_and_labels != null) {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was added as the ' +
            data.terms_and_labels.region_reviewer +
            ' in <b>' +
            data.extra_message +
            ' ' +
            data.terms_and_labels.region +
            '</b> of <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> by <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        } else {
          content =
            '<b><a href="' +
            data.get_source_url +
            '">' +
            data.source_name +
            '</a></b> was added as the Region Reviewer in <b>' +
            data.extra_message +
            ' Regions</b> of <b><a href="' +
            data.get_event_url +
            '">' +
            data.get_event_name +
            '</a></b> by <b><a href="' +
            data.get_extraobj_url +
            '">' +
            data.get_extraobj_name +
            '</a></b>.';
        }
        return content;
      // ------------ handling errors ---------
      case 412:
        const errormsg = data.extra_message;
        const messages = errormsg.split('@error');
        let readableerror = '';
        if (messages.length > 1) {
          const errors = messages[1].split('DETAIL:');
          if (errors.length > 1) {
            readableerror = errors[1];
          } else {
            readableerror = errors[0];
          }
        } else {
          readableerror = messages[0];
        }

        content =
          'Bulk upload of ' +
          messages[0] +
          ' has <span style="color:maroon;""><b>failed</b></span> in project <a href="' +
          data.get_event_url +
          '"><b>' +
          data.get_event_name +
          '</a></b>. <b>Error:  </b>' +
          readableerror;
        return content;
      case 421:
        content =
          'Multi Role assign for ' +
          data.extra_message +
          ' has <span style="color:maroon;"><b>failed</b></span> in Team <a href="' +
          data.get_event_url +
          '"><b>' +
          data.get_event_name +
          '</a></b>.';
        return content;
      case 422:
        content =
          data.extra_message +
          ' has <span style="color:maroon;"><b>failed</b></span> in project <a href="' +
          data.get_event_url +
          '"><b>' +
          data.get_event_name +
          '</a></b>.';
        return content;
      case 429:
        content =
          'Project Sites import from <a href="' +
          data.get_extraobj_url +
          '"><b>' +
          data.get_extraobj_name +
          '</a></b> has <span style="color:maroon;"><b>failed</b></span> in project <a href="' +
          data.get_event_url +
          '"><b>' +
          data.get_event_name +
          '</a></b>.';
        return content;
      case 430:
        content =
          data.extra_message +
          '<a href="' +
          data.get_extraobj_url +
          '"><b>' +
          data.get_extraobj_name +
          '</a></b> has <span style="color:maroon;"><b>failed</b></span> in project <a href="' +
          data.get_event_url +
          '"><b>' +
          data.get_event_name +
          '</a></b>.';
        return content;
      case 432:
        content =
          data.title +
          ' <a href="' +
          data.get_event_url +
          '"><b>' +
          data.get_event_name +
          '</a></b></a></b> has <span style="color:maroon;"><b>failed</b></span>. ' +
          data.extra_message;
        return content;
      default:
        return content;
    }
  };

  groupByDate = logs => {
    const groups = logs.reduce((groups, log) => {
      const date = log.date.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(log);
      return groups;
    }, {});

    const groupArrays = Object.keys(groups).map(date => {
      return {
        date,
        logs: groups[date],
      };
    });

    return groupArrays;
  };

  getColor = () => {
    const colorArr = ['red', 'blue', 'green'];
    return colorArr[Math.floor(Math.random() * colorArr.length)];
  };

  componentDidUpdate() {
    if (this.timeLineDiv) {
      const anchorList = this.timeLineDiv.getElementsByTagName('a');
      for (let i = 0; i < anchorList.length; i++) {
        anchorList[i].setAttribute('target', '_blank');
      }
    }
  }

  render() {
    const {
      props: {
        siteLogs,
        showContentLoader,
        siteId,
        type,
        user_id,
        fullPage,
      },
      groupByDate,
      getColor,
      getLog,
      sitewidth,
    } = this;

    return (
      <div className={fullPage ? 'col-md-12' : 'col-xl-4 col-md-12'}>
        <div className="card logs">
          <div className="card-header main-card-header sub-card-header">
            {/* <h5>Logs</h5>*/}
            <h5>
              <FormattedMessage id="app.logs" defaultMessage="Logs" />
            </h5>

            {siteLogs.length > 0 ? (
              fullPage ? null : (
                <Link
                  to={`/${type}_logs/${siteId}/`}
                  className="fieldsight-btn"
                >
                  {/*View all*/}
                  <FormattedMessage
                    id="app.view-all"
                    defaultMessage="View all"
                  />
                </Link>
              )
            ) : null}
          </div>
          <div className="card-body">
            <div
              className="logs-list"
              style={
                fullPage
                  ? {}
                  : { position: 'relative', height: '314px' }
              }
            >
              {showContentLoader ? (
                <BlockContentLoader number={2} height="150px" />
              ) : (
                <PerfectScrollbar>
                  {siteLogs.length > 0 ? (
                    <div
                      className="timeline"
                      ref={el => (this.timeLineDiv = el)}
                    >
                      {groupByDate(siteLogs).map(siteLog => {
                        return (
                          <div className="timeline-list" key={uuid()}>
                            <time>{siteLog.date}</time>
                            <ul>
                              {siteLog.logs.map(log => (
                                <li className="blue" key={uuid()}>
                                  <div className="event-list ">
                                    <figure>
                                      <img
                                        src={log.source_img}
                                        alt="logo"
                                      />
                                    </figure>
                                    <div className="log-content">
                                      <span className="time">
                                        {format(log.date, ['h:mm a'])}
                                      </span>

                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: getLog(
                                            log,
                                            user_id,
                                          ),
                                        }}
                                      />
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p> No Data Available </p>
                  )}
                </PerfectScrollbar>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Logs;
