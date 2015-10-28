package com.okcoin.extrascontroller.about;

import com.alibaba.fastjson.JSONObject;
import com.okcoin.extrasdao.bean.active.PraiseInfo;
import com.okcoin.extrasdao.bean.active.WechatUser;
import com.okcoin.extrasdao.util.WeixinUtil;
import com.okcoin.extrasdao.util.XMemcachedUtil;
import com.okcoin.extrasservice.active.ActiveService;
import com.okcoin.util.CoinConstants;
import com.okcoin.util.Logs;
import com.okcoin.util.StringUtil;
import com.okcoin.util.WeChatUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by bixiaofeng on 2015/10/22.
 */

@Controller
@RequestMapping("/about")
public class ActivityController {

    private static final String WECHAT_ACC_CODE_URL = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect";

    private static final String BASE_SCOPE = "snsapi_base";
    private static final String USERINFO_SCOPE = "snsapi_userinfo";

    @Autowired
    private ActiveService activeService;

    /* 用户信息录入 */
    @RequestMapping("/confirm")
    public String confirm(HttpServletRequest request, HttpServletResponse response){

        String code = request.getParameter("code");
         //state的首个数 1 首页 2 点赞页或挑赞页
        String stateStr = request.getParameter("state");
        if(StringUtil.isEmpty(stateStr)){
            Logs.geterrorLogger().error("state is empty");
            return null;
        }
        Logs.geterrorLogger().error("state :" + stateStr);

        Integer state = null;
        //以后用来跳转的state值
        //判断state 是否是由 1或2+friendKey组成的
        String redirectState = null;
        if(stateStr.length() > 1){
            state = StringUtil.toInteger(stateStr.substring(0,1), 0);
            Logs.geterrorLogger().error(" 有 friendKey ");
            redirectState = stateStr.substring(1, stateStr.length());
            Logs.geterrorLogger().error("redirectState: " + redirectState);
        }else{
            state = StringUtil.toInteger(stateStr, 0);
            redirectState = "btc";
            Logs.geterrorLogger().error(" 没有 friendKey");
        }
        Logs.geterrorLogger().error("redirectState:" + redirectState);

        //state 不是一个数字  或者 state是2 ，但没有friendKey
        if(state == 0 || (state == 2 && "btc".equals(redirectState))){
            Logs.geterrorLogger().error("state is not a number : " + state);
            Logs.geterrorLogger().error("state == 2 && 没有friendKey");
            return null;
        }
        Logs.geterrorLogger().error("当前要跳转的state是" + state);

        //通过code获取openId
        if(StringUtil.isEmpty(code) || (state != 1 && state != 2)){
            Logs.geterrorLogger().error("code is empty or state is not 1 and 2");
            return null;
        }
        Logs.geterrorLogger().error("code: " + code + " state " + state);
        JSONObject jsonObject = WeChatUtils.getAccessToken(code);
        if(jsonObject == null){
            Logs.geterrorLogger().error(" jsonObject is null");
            return null;
        }
        Logs.geterrorLogger().error("通过code获取的 jsonObject :" + jsonObject);
        String openId = jsonObject.get("openid").toString();
        if(StringUtil.isEmpty(openId)){
            Logs.geterrorLogger().error(" openId is empty");
            return null;
        }
        Logs.geterrorLogger().error("openId :" + openId);

        //根据openId查看是否已经在数据库中
        WechatUser user = activeService.getWechatUserByOpenId(openId);
        String scope = null;
        if(user == null)
        {
            Logs.geterrorLogger().error("用户是新的, 下个页面要验证,scope=userinfo");
            scope = USERINFO_SCOPE;
        }else{
            Logs.geterrorLogger().error("user: " + user);
            scope = BASE_SCOPE;
        }

        //到首页
        if(state == 1){
            return "redirect:https://open.weixin.qq.com/connect/oauth2/authorize?appid="+CoinConstants.WECHAT_APP_ID+"&redirect_uri=https://www.okcoin.com/about/toHost.do&response_type=code&scope="+scope+"&state="+redirectState+"#wechat_redirect";
        }else if(state == 2){//到点赞或集赞页
            return "redirect:https://open.weixin.qq.com/connect/oauth2/authorize?appid="+CoinConstants.WECHAT_APP_ID+"&redirect_uri=https://www.okcoin.com/about/praiseInfo.do&response_type=code&scope="+scope+"&state="+redirectState+"#wechat_redirect";
        }else {
            return null;
        }

    }

    /* 第一次首页页面 */
    @RequestMapping("/toHost")
    public String toHost(HttpServletRequest request, HttpServletResponse response){
        //根据code获取openId
        String code = request.getParameter("code");
        String state = request.getParameter("state");
        if(StringUtil.isEmpty(code) || StringUtil.isEmpty(state) ){
            Logs.geterrorLogger().error(" code or state is empty");
            return null;//new ModelAndView("/");
        }
        JSONObject jsonObject = WeChatUtils.getAccessToken(code);
        if(jsonObject == null){
            Logs.geterrorLogger().error(" jsonobject is empty");
            return null;
        }
        String openId = (String)jsonObject.get("openid");
        if(StringUtil.isEmpty(openId)){
            Logs.geterrorLogger().error(" openId is empty ");
        }

        //根据openId查看是否已经在数据库中
        WechatUser user = activeService.getWechatUserByOpenId(openId);

        //添加到数据库，设置praiseNum = 0
        if(user == null){
            String accessToken = jsonObject.get("access_token").toString();
            insertUser(openId, accessToken, false);
        }

        //给当前页面签名
        StringBuffer url = new StringBuffer("https://www.okcoin.com/about/toHost.do");
        url.append("?code="+code);
        url.append("&state="+state);
        Map<String, String> jsApi = WeixinUtil.getJsSign(url.toString(), CoinConstants.WECHAT_APP_ID, CoinConstants.WECHAT_SECRET, "weixin_jsApi_active");
        Logs.geterrorLogger().error("jsApi : " + jsApi);

        String shareLink = WECHAT_ACC_CODE_URL;
        shareLink = shareLink.replace("APPID", CoinConstants.WECHAT_APP_ID);
        shareLink = shareLink.replace("REDIRECT_URI", "https://www.okcoin.com/about/confirm.do");
        shareLink = shareLink.replace("SCOPE", "snsapi_base");
        shareLink = shareLink.replace("STATE", "1");
        request.setAttribute("shareLink", shareLink);
        Logs.geterrorLogger().error("shareLink : " + shareLink);

        request.setAttribute("jsApi", jsApi);

        //计时结束时间
        Date endTime = getEndTime();
        request.setAttribute("endTime", endTime.getTime());

        return "/about/active_index";
    }

    /* 点赞 */
    @RequestMapping("/praise")
    public String praise(HttpServletRequest request, HttpServletResponse response) throws IOException {

        //点赞人的openId
        String fromOpenId = request.getParameter("openId");
        Long myKey = StringUtil.toLong(request.getParameter("myKey"), 0l);
        Long friendKey = StringUtil.toLong(request.getParameter("friendKey"), 0l);

        //myKey or friendKey is wrong
        //myKey 和 friendKey 一样
        if(myKey == 0 || friendKey == 0 || myKey == friendKey){
            Logs.geterrorLogger().error("myKey or friendKey or myKey is empty");
            return null;
        }

        Logs.geterrorLogger().error("myKey: "+ myKey);
        Logs.geterrorLogger().error("friendKey: " + friendKey);
        Logs.geterrorLogger().error("fromOpenId: " + fromOpenId);
        WechatUser user = activeService.getWechatUserByKey(myKey);
        WechatUser friend = activeService.getWechatUserByKey(friendKey);
        //当前用户的信息有误，没取到
        //被点赞人的信息有误，没取到
        //被点赞人没有参加活动
        //openId 或 key 不是当前用户的
        if(user == null || friend == null || friend.getPraiseNum().equals(0) || !user.getOpenId().equals(fromOpenId)){
            Logs.geterrorLogger().error("user or friend is empty friend doesnot join or user.openId is not equal with key");
            return  null;//new ModelAndView("/");
        }

        String praiseOpenId = friend.getOpenId();

        //当前用户已经给此人点过赞
        if(activeService.isPraise(praiseOpenId, fromOpenId)){
            Logs.geterrorLogger().error(" user had praised this friend");
            return null;//new ModelAndView("/");
        }

        //记录点赞人和被点赞人
        PraiseInfo praiseInfo = new PraiseInfo();
        praiseInfo.setOpenId(praiseOpenId);
        praiseInfo.setFromOpenId(fromOpenId);
        activeService.insertPraiseInfo(praiseInfo);

        //给被点赞人加赞
        activeService.addPraiseNum(friendKey);

        /**
         * 改成AJAX,不用显示信息了,以后有需要的时候再用
         */
        //获取被点赞人的信息在页面显示
//		WechatUser praiseUser = activeService.getWechatUserByOpenId(praiseOpenId);
//		praiseUser.setPraiseNum(praiseUser.getPraiseNum()+1);
//		activeService.addPraiseNum(praiseUser.getKey());
//
//		request.setAttribute("user", praiseUser);

        return null;//new ModelAndView("/");
    }

    @RequestMapping("/praiseInfo")
    public String praiseInfo(HttpServletRequest request, HttpServletResponse response){
        String code = request.getParameter("code");
        String state = request.getParameter("state");

        //根据code获取openId
        StringBuffer log = new StringBuffer();
        log.append("code : " + code + " state: " + state );
        if(StringUtil.isEmpty(code) || StringUtil.isEmpty(state)){
            Logs.geterrorLogger().error(" code or state is empty");
            return null;//new ModelAndView("/");
        }
        JSONObject jsonObject = WeChatUtils.getAccessToken(code);
        if(jsonObject == null){
            Logs.geterrorLogger().error(" jsonobject is empty");
            return null;
        }
        String openId = (String)jsonObject.get("openid");
        if(StringUtil.isEmpty(openId)){
            Logs.geterrorLogger().error(" openId is empty ");
        }

        //根据openId查看是否已经在数据库中
        WechatUser user = activeService.getWechatUserByOpenId(openId);
        //没有就添加，设置praiseNum = 0 ，表示没有参加
        if(user == null){
            String accessToken = (String)jsonObject.get("access_token");
            user = insertUser(openId, accessToken, false);
            if(user == null){
                Logs.geterrorLogger().error("user also is empty");
                return null;
            }
        }
        user.setRank(activeService.getUserRank(user.getPraiseNum(), user.getKey(), user.getCreatedDate()));
        request.setAttribute("user", user);

        //给当前页面签名
        StringBuffer url = new StringBuffer("https://www.okcoin.com/about/praiseInfo.do");
        url.append("?code="+code);
        url.append("&state="+state);
        Map<String, String> jsApi = WeixinUtil.getJsSign(url.toString());
        log.append(" jsapi: " + jsApi);
        Logs.geterrorLogger().error(log.toString());
        request.setAttribute("jsApi", jsApi);

        //被点赞用户信息
        Long friendKey = StringUtil.toLong(state, 0l);
        if(friendKey == 0){
            Logs.geterrorLogger().error(" friendKey is wrong");
            return null;
        }
        WechatUser friend = activeService.getWechatUserByKey(friendKey);
        if(friend == null){
            Logs.geterrorLogger().error(" friend is empty ");
            return null;
        }
        friend.setRank(activeService.getUserRank(friend.getPraiseNum(), friend.getKey(), friend.getCreatedDate()));
        request.setAttribute("isPraise", true);
        request.setAttribute("friend", friend);

        //前十名用户
        List<WechatUser> topTen = activeService.getTopTenPraiseUser();
        request.setAttribute("topTen", topTen);

        //计时结束时间
        Date endTime = getEndTime();
        request.setAttribute("endTime", endTime.getTime());

        //分享的链接
        String shareLink = WECHAT_ACC_CODE_URL;
        shareLink = shareLink.replace("APPID", CoinConstants.WECHAT_APP_ID);
        shareLink = shareLink.replace("SCOPE", "snsapi_base");
        shareLink = shareLink.replace("REDIRECT_URI", "https://www.okcoin.com/about/confirm.do");
        shareLink = shareLink.replace("STATE", "2"+friendKey.toString());
        request.setAttribute("shareLink", shareLink);

        return "/about/myinfo";
    }

    /* 我也要抢 */
    @RequestMapping("/join")
    public String join(HttpServletRequest request, HttpServletResponse response){
        String code = request.getParameter("code");
        String state = request.getParameter("state");

        //根据code获取openId
        StringBuffer log = new StringBuffer();
        log.append("code : " + code + " state: " + state );
        Logs.geterrorLogger().error(log.toString());

        if(StringUtil.isEmpty(code) || StringUtil.isEmpty(state)){
            Logs.geterrorLogger().error(" code or state is empty");
            return null;//new ModelAndView("/");
        }
        JSONObject jsonObject = WeChatUtils.getAccessToken(code);
        if(jsonObject == null){
            Logs.geterrorLogger().error(" jsonObject is empty");
            return null;
        }
        String openId = (String)jsonObject.get("openid");
        log.append(" openId: " + openId);
        if(StringUtil.isEmpty(openId)){
            Logs.geterrorLogger().error("openId is empty");
            return null;
        }

        //查看当前用户是否已经存在
        //是否已经在数据库中存过用户信息
        WechatUser user = activeService.getWechatUserByOpenId(openId);
        if(user == null){
            String accessToken = jsonObject.get("access_token").toString();
            //设置praiseNum = 1 表示已经参加了
            user = insertUser(openId, accessToken, true);
            Logs.geterrorLogger().error("之前没有用户信息，添加后为1 ");
        }else{    //把praiseNum设为1，0表示未参加
            if (user.getPraiseNum() == 0){
                user.setPraiseNum(1l);
                activeService.joinActive(user);
                user = activeService.getWechatUserByKey(user.getKey());
                Logs.geterrorLogger().error("之前有用户信息，现在改为1");
            }
            Logs.geterrorLogger().error("join user.key: " + user.getKey());
        }
        //获取当前排名
        user.setRank(activeService.getUserRank(user.getPraiseNum(), user.getKey(), user.getCreatedDate()));
        request.setAttribute("user", user);

        Map<String, String> jsApi = WeixinUtil.getJsSign("https://www.okcoin.com/about/join.do?code="+code+"&state="+state);
        log.append(" jsapi: " + jsApi);
        Logs.geterrorLogger().error(log.toString());

        request.setAttribute("jsApi", jsApi);

        //分享的链接
        String shareLink = WECHAT_ACC_CODE_URL;
        shareLink = shareLink.replace("APPID", CoinConstants.WECHAT_APP_ID);
        shareLink = shareLink.replace("SCOPE", "snsapi_base");
        shareLink = shareLink.replace("REDIRECT_URI", "https://www.okcoin.com/about/confirm.do");
        shareLink = shareLink.replace("STATE", "2"+user.getKey().toString());
        request.setAttribute("shareLink", shareLink);

        //前十名用户
        List<WechatUser> topTen = activeService.getTopTenPraiseUser();
        request.setAttribute("topTen", topTen);

        //计时结束时间
        Date endTime = getEndTime();
        request.setAttribute("endTime", endTime.getTime());

        return "/about/myinfo";
    }

    private Date getEndTime(){
        SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date end = null;
        try {
            //东8 12+8
            end = sf.parse("2015-11-27 1:00:00");
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return end;
    }

    private WechatUser insertUser(String openId, String accessToken, boolean join){
        WechatUser user = new WechatUser();
        Logs.geterrorLogger().error("添加新用户");
        if(StringUtil.isEmpty(accessToken)){
            Logs.geterrorLogger().error(" access_token is empty");
            return null;
        }
        JSONObject userInfo = WeChatUtils.getUserInfo(accessToken, openId);
        user.setOpenId(openId);
        if(join){
            user.setPraiseNum(1l);
        }else {
            user.setPraiseNum(0l);
        }
        user.setHeadImg(userInfo.get("headimgurl").toString());
        user.setNickname(userInfo.get("nickname").toString());
        long key = activeService.insertWechatUser(user);
        user = activeService.getWechatUserByKey(key);
        return user;
    }
}