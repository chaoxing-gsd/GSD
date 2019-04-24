package com.chaoxing.gsd.utils;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Random;

/**
 * @author heyang
 * @date 2018/08/30
 * describe:HTTP工具类
 */
public class HttpUtils {
    private static final int TIME_OUT = 8000;                          //超时时间
    private static final String PREFIX = "--";                            //前缀
    private static final String BOUNDARY = maketoken();  //边界标识 随机生成
    private static final String CONTENT_TYPE = "multipart/form-data";     //内容类型
    private static final String LINE_END = "\r\n";                        //换行

    /**
     *@author heyang
     *@param file
     *describe: 文件上传至超星存储
     */
    public static String  upLoad(File file)throws Exception {
        String result="";
        HttpURLConnection conn = null;
        String requestUrl="http://cs.ananas.chaoxing.com/upload";
        try {
            URL url = new URL(requestUrl);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setReadTimeout(TIME_OUT);
            conn.setConnectTimeout(TIME_OUT);
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setUseCaches(false);//Post 请求不能使用缓存
            //设置请求头参数
            conn.setRequestProperty("Connection", "Keep-Alive");
            conn.setRequestProperty("Charset", "UTF-8");
            conn.setRequestProperty("Content-Type", CONTENT_TYPE+";boundary=" + BOUNDARY);
            //请求体
            DataOutputStream dos = new DataOutputStream(conn.getOutputStream());
            //文件上传
            StringBuilder fileSb = new StringBuilder();
            fileSb.append(PREFIX)
                    .append(BOUNDARY)
                    .append(LINE_END)
                    /**
                     * 这里重点注意： name里面的值为服务端需要的key 只有这个key 才可以得到对应的文件
                     * filename是文件的名字，包含后缀名的 比如:abc.png
                     */
                    .append("Content-Disposition: form-data; name=\"file\"; filename=\""
                            + file.getName() + "\"" + LINE_END)
                    .append("Content-Type: image/jpg" + LINE_END) //此处的ContentType不同于 请求头 中Content-Type
                    .append("Content-Transfer-Encoding: 8bit" + LINE_END)
                    .append(LINE_END);// 参数头设置完以后需要两个换行，然后才是参数内容
            dos.writeBytes(fileSb.toString());
            dos.flush();
            InputStream is = new FileInputStream(file);
            byte[] buffer = new byte[1024];
            int len = 0;
            while ((len = is.read(buffer)) != -1){
                dos.write(buffer,0,len);
            }
            is.close();
            dos.writeBytes(LINE_END);

            //请求结束标志
            dos.writeBytes(PREFIX + BOUNDARY + PREFIX + LINE_END);
            dos.flush();
            dos.close();
            //读取服务器返回信息
            if (conn.getResponseCode() == 200) {
                InputStream in = conn.getInputStream();
                BufferedReader reader = new BufferedReader(new InputStreamReader(in));
                String line = null;
                StringBuilder response = new StringBuilder();
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                result=""+response;
            }else{
                result="上传失败,请联系管理员";
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            if (conn!=null){
                conn.disconnect();
            }
        }
        return result;
    }

    public static  String maketoken(){
        long millis = System.currentTimeMillis();
        Random random = new Random();
        int end3 = random.nextInt(999);
        return millis + String.format("%03d", end3);
    }



}
