/**
 * Created by Aaron on 2018/6/21.
 */
import { connect } from 'react-redux'

const tokenKey="chaoxing_user"


const getAuth=()=>{
    var t;
    if (t == null) t = localStorage.getItem(tokenKey);
    if (t == null) t = sessionStorage.getItem(tokenKey);
    return t;
}

const isAuth=()=>{
    return getAuth()!=null;

}




const userAuth=(nextState, replace, next) =>{
    var t=getAuth();
    if (t) return next()
    next();
}

const mapStateToProps = (state, ownProps) => {
    return {

    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(userAuth)