package com.chaoxing.gsd.service;

import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;

import java.util.List;

/**
 * @Author: longrui
 * @Date: 2018/4/26 11:56
 */
public class ESHighlight {

    private  HighlightBuilder hiBuilder = new HighlightBuilder();

     {
        hiBuilder.preTags("<h2>"); // <span style=\"color: rgb(181, 53, 53); font-size: 14px;\">
        hiBuilder.postTags("</h2>");// </span>
    }

    public  List<String> setHighlightField(List<String> HighlightList) {
        for (String s : HighlightList) {
            hiBuilder.field(s);
        }
        return HighlightList;
    }

    public HighlightBuilder getHiBuilder() {
        return hiBuilder;
    }

    public void setHiBuilder(HighlightBuilder hiBuilder) {
        this.hiBuilder = hiBuilder;
    }
}
