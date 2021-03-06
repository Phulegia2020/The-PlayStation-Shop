package com.example.nashtechproject.restcontroller;

import com.example.nashtechproject.dto.ProductDTO;
import com.example.nashtechproject.entity.Product;
import com.example.nashtechproject.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.json.JsonGenerator;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.dialogflow.v2beta1.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.StringWriter;
import java.util.*;

import static java.util.Arrays.asList;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class DialogflowController {
    @Autowired
    private final JacksonFactory jacksonFactory;

    @Autowired
    private ProductService productService;

    public DialogflowController(JacksonFactory jacksonFactory) {
        this.jacksonFactory = jacksonFactory;
    }

    @PostMapping(value = "/dialogflow-webhook", produces = {MediaType.APPLICATION_JSON_VALUE})
    public String webhook(@RequestBody String rawData, HttpServletRequest rq) throws IOException
    {
        GoogleCloudDialogflowV2WebhookRequest request = jacksonFactory
                .createJsonParser(rawData)
                .parse(GoogleCloudDialogflowV2WebhookRequest.class);

        String displayName = request.getQueryResult().getIntent().getDisplayName();
        GoogleCloudDialogflowV2IntentMessage msg = new GoogleCloudDialogflowV2IntentMessage();
        GoogleCloudDialogflowV2IntentMessageText text = new GoogleCloudDialogflowV2IntentMessageText();
        ProductDTO products;
        List<String> chat = new ArrayList<>();

        switch (displayName)
        {
            case "Info-Intent":
            {
                if (request.getQueryResult().getParameters().get("product").toString().equals("PS"))
                {
                    chat.add("Hi???n t???i c???a h??ng ch??a kinh doanh m??y n??y. B???n c?? th??? tham kh???o v??? m??y Playstation 4 v?? Playstation 5 t???i shop !");
                }
                else
                {
                    products = productService.getProductChatBot(request.getQueryResult().getParameters().get("product").toString());
                    if (products == null)
                    {
                        chat.add("Hi???n t???i c???a h??ng ch??a kinh doanh m??y n??y. B???n c?? th??? tham kh???o v??? m??y Playstation 4 v?? Playstation 5 t???i shop !");
                    }
                    else
                    {
                        if (products.getQuantity() > 0)
                        {
                            chat.add("Hi???n t???i m??y " + products.getName() + " v???n c??n h??ng b???n nh??!");
                        }
                        else
                        {
                            chat.add("Hi???n t???i m??y " + products.getName() + " ???? h???t h??ng! B???n c?? th??? tham kh???o th??m m???t s??? lo???i m??y kh??c nh??.");
                        }
                    }
                }
                break;
            }
            case "Price-PS-Intent":
            {
                if (request.getQueryResult().getParameters().get("product").toString().equals("PS"))
                {
                    chat.add("Hi???n t???i c???a h??ng ch??a kinh doanh m??y n??y. B???n c?? th??? tham kh???o v??? m??y Playstation 4 v?? Playstation 5 t???i shop !");
                }
                else {
                    products = productService.getProductChatBot(request.getQueryResult().getParameters().get("product").toString());
                    if (products == null) {
                        chat.add("Hi???n t???i c???a h??ng ch??a kinh doanh m??y n??y. B???n c?? th??? tham kh???o v??? m??y Playstation 4 v?? Playstation 5 t???i shop !");
                    } else {
                        chat.add("M??y " + products.getName() + " c?? gi?? " + String.format("%,d", products.getPrice()) + " VN?? \uD83D\uDCB8. N???u b???n l?? m???t ng?????i ??am m?? playstation th?? m??y " + products.getName() + " l?? b??? m??y h???p l?? trong th???i ??i???m hi???n t???i v?? cung c???p tr???i nghi???m ch??i game hi???u qu??? cho nhi???u ng?????i d??ng");
                    }
                }
                break;
            }
        }

        text.setText(chat);
        msg.setText(text);
        GoogleCloudDialogflowV2WebhookResponse response = new GoogleCloudDialogflowV2WebhookResponse();
        response.setFulfillmentMessages(asList(msg));

        StringWriter stringWriter = new StringWriter();
        JsonGenerator jsonGenerator = jacksonFactory.createJsonGenerator(stringWriter);
        jsonGenerator.enablePrettyPrint();
        jsonGenerator.serialize(response);
        jsonGenerator.flush();

        return stringWriter.toString();
    }
}
