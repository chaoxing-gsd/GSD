package com.chaoxing.gsd.service;

import org.springframework.stereotype.Service;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.util.List;
import java.util.Map;

@Service
/**
 *@author heyang
 *@param ${param}
 *describe: 下载索引类
 */
public class DownloadIndexService {

    public void bufferedOutputTest(String str, File file) throws Exception {
        FileWriter fw = new FileWriter(file, true);
        BufferedWriter bw = new BufferedWriter(fw);
        bw.write(str);
        bw.write("\r\n");
        bw.flush();
        bw.close();
    }


    public void writeris(List<Map<String,Object>> list, File file) throws Exception {
    	// TODO 每行尾部 [ER  -] 记得添加，不然批量两个软件不兼容
        for (Map<String,Object> map:list){
            String message_type= (String) map.get("message_type");
            String content="";
            if("BK".equals(message_type)){
                content = "\r\n\r\nTY  - " +map.get("message_type")+"\r\n"
                         +"ID  - "+map.get("book_num")+"\r\n"
                        +"AU  - "+map.get("author")+"\r\n"
                         +"T1  - "+map.get("title")+"\r\n"
                        +"T3  - "+map.get("book_name")+"\r\n"
                        +"Y1  - "+map.get("Pub_date")+"\r\n"
                         +"M3  - "+map.get("book_num")+"\r\n"
                         +"PB  - "+map.get("publishing_house")+"\r\n"
                         +"SN  - "+map.get("ISBN")+"\r\n"
                         +"KW  - "+map.get("subject_term")+"\r\n"
                         +"N1  - "+map.get("digest")+"\r\n"
                         +"UR  - "+map.get("url")
                        +"ER  -";
            }else if("JN".equals(message_type)){
                content = "\r\n\r\nTY  - " +map.get("message_type")+"\r\n"
                        +"AU  - "+map.get("author")+"\r\n"
                        +"T1  - "+map.get("title")+"\r\n"
                        +"JO  - "+map.get("journal_name")+"\r\n"
                        +"Y1  - "+map.get("year")+"\r\n"
                        +"VL  - "+map.get("journal_num")+"\r\n"
                        +"SP  - "+map.get("page_num")+"\r\n"
                        +"EP  - "+map.get("page_num")+"\r\n"
                        +"AB  - "+map.get("digest")+"\r\n"
                        +"KW  - "+map.get("keyWord")+"\r\n"
                        +"N1  - "+map.get("author_unit")+"\r\n"
                        +"L3  - "+map.get("DOI")+"\r\n"
                        +"UR  - "+map.get("url")
                        +"ER  -";
            }else if("NP".equals(message_type)){
                content = "\r\n\r\nTY  - NEWS\r\n"
                        +"T1  - "+map.get("title")+"\r\n"
                        +"JO  - "+map.get("NPn")+"\r\n"
                        +"Y1  - "+map.get("Pub_date")+"\r\n"
                        +"SN  - "+map.get("edition")+"\r\n"
                        +"UR  - "+map.get("url")
                        +"ER  -";
            }else if("DT".equals(message_type)){
                content = "\r\n\r\nTY  - " +map.get("message_type")+"\r\n"
                        +"AU  - "+map.get("author")+"\r\n"
                        +"T1  - "+map.get("title")+"\r\n"
                        +"JO  - "+map.get("journal_name")+"\r\n"
                        +"Y1  - "+map.get("year")+"\r\n"
                        +"VL  - "+map.get("Pub_date")+"\r\n"
                        +"SP  - "+map.get("page_num")+"\r\n"
                        +"EP  - "+map.get("page_num")+"\r\n"
                        +"AB  - "+map.get("digest")+"\r\n"
                        +"KW  - "+map.get("keyWord")+"\r\n"
                        +"N1  - "+map.get("degree_conferring_unit")+"\r\n"
                        +"L3  - "+map.get("DOI")+"\r\n"
                        +"UR  - "+map.get("url")
                        +"ER  -";
            }else if("PT".equals(message_type)){
                content = "\r\n\r\nTY  - " +map.get("message_type")+"\r\n"
                        +"PY  - "+map.get("Open_date")+"\r\n"
                        +"M3  - PT\r\n"
                        +"UR  - "+map.get("url")
                        +"ER  -";
            }else {
                content = "\r\n\r\nTY  - " +map.get("message_type")+"(目前不支持该类型文献导出)\r\n";
            }
            //往文件写内容
            bufferedOutputTest(content,file);
        }
    }

    public void writebib(List<Map<String,Object>> list, File file) throws Exception {
    	// TODO 每行头[index,] 记得添加，不然批量两个软件不兼容
    	int index = 0;
        for (Map<String,Object> map:list){
            String message_type=(String)map.get("message_type");
            String content="";
            if(message_type.equals("BK")){
                content = "\r\n\r\n@book{\r\n"+index
                        +",author={"+map.get("author")+"},\r\n"  
                        +"year={"+map.get("Pub_date")+"},\r\n"
                        +"title={"+map.get("title")+"},\r\n"
                        +"publisher={"+map.get("basic_publisher")+"},\r\n"
                        +"address={"+map.get("publishing_house")+"},\r\n"
                        +"isbn={"+map.get("ISBN")+"},\r\n}"
                        +"url={"+map.get("url")+"},\r\n}";
            }else if(message_type.equals("JN")){
                content = "\r\n\r\n@article{\r\n"+index
                        +",author={"+map.get("author")+"},\r\n"  
                        +"year={"+map.get("Pub_date")+"},\r\n"
                        +"title={"+map.get("title")+"},\r\n"
                        +"journal={"+map.get("journal_name")+"},\r\n"
                        +"number={"+map.get("journal_num")+"},\r\n"
                        +"pages={"+map.get("page_num")+"},\r\n"
                        +"abstract={"+map.get("digest")+"},\r\n"
                        +"keywords={"+map.get("keyWord")+"},\r\n"
                        +"isbn={"+map.get("ISSN")+"},\r\n"
                        +"url={"+map.get("url")+"},\r\n}";
            }else if("NP".equals(message_type)){
                content = "\r\n\r\n@misc{\r\n"+index
                        +",year={"+map.get("Pub_date")+"},\r\n"
                        +"title={"+map.get("title")+"},\r\n"
                        +"journal={"+map.get("journal_name")+"},\r\n"
                        +"url={"+map.get("url")+"},\r\n}";
            }else if("DT".equals(message_type)){
                content = "\r\n\r\n@phdthesis{\r\n"+index
                        +",author={"+map.get("tutor_name")+"},\r\n"
                        +"title={"+map.get("title")+"},\r\n"
                        +"url={"+map.get("url")+"},\r\n}";

            }else if("PT".equals(message_type)){
                content = "\r\n\r\n@misc{\r\n"+index
                        +",author={"+map.get("inventor")+"},\r\n"
                        +"year={"+map.get("Open_date")+"},\r\n"
                        +"title={"+map.get("title")+"},\r\n"
                        +"keywords={"+map.get("publication_number")+"},\r\n"
                        +"url={"+map.get("url")+"},\r\n}";


            }else if("INF".equals(message_type)){
                content = "\r\n\r\n@misc{\r\n"+index
                        +",year={"+map.get("year")+"},\r\n"
                        +"title={"+map.get("title")+"},\r\n"
                        +"abstract={"+map.get("digest")+"},\r\n"
                        +"URL={"+map.get("url")+"},\r\n}";
            }else {
                content = "\r\n\r\n@" +map.get("message_type")+"{目前不支持该类型文献导出}\r\n";
            }
            //往文件追加内容
            bufferedOutputTest(content, file);
            index++;
        }

    }

}