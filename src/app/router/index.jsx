import {HashRouter,Switch,Route,Redirect} from 'react-router-dom';
import Login from '../containers/Login/index';
import SignUp from '../containers/SignUp/index';
import Blogs from '../containers/Blogs/index';
import {paths} from '../constants/paths';

const Router = ()=>{
return (
    <HashRouter basename='/'>
        <Switch>
            <Route exact path={paths.LOGIN.path} component={Login}/>
            <Route exact path={paths.SIGNUP.path} component={SignUp}/>
            <Route exact path={paths.BLOGS.path} component={Blogs}/>
            <Route path='*' component ={<Redirect to ='/'/>} />
            </Switch>
    </HashRouter>)
}
export default Router;