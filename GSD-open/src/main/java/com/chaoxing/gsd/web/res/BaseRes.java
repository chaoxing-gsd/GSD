package com.chaoxing.gsd.web.res;

public class BaseRes {


    public static BaseResponse getErrorResponse(){
        BaseResponse errorResponse=new BaseResponse();
        errorResponse.setStatu(false);
        errorResponse.setMsg("系统维护中，请稍后再试");
        return errorResponse;
    }
}
