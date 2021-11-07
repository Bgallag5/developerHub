import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


const Alert = ({ alerts }) => 
    alerts !== null && alerts.length > 0 && alerts.map(alert => (
    <div style={{margin: '5%'}} className={`alert alert-${alert.alertType}`} key={alert.id}>{alert.msg}</div>
    ))

Alert.propTypes = {
alerts: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
    alerts: state.alert
})

//mapStateToProps is exported, so we have access to it in props ^
export default connect(mapStateToProps)(Alert);
