---
layout: post
title: "用Win32 API写的EAN-13条形码生成器"
subtitle: "用WM_PAINT搭配TextOut和drawLine写的EAN-13国际商品条码计算器"
date: 2014-11-25 19:30
comments: true
author: MewX
published: true
categories: [win32, barcode]
---

EAN-13是商品中广泛使用的条码，今天上条码课（汗——）布置这个任务，咱就用Win32 API写了个简单的条码生成器，代码分享一下，如果有需要请自取。

这个EAN-13条码生成器写的部分倒是不多，因为是使用GDI32的程序，所以主体部分是Windows程序的消息循环，我处理的就是WM_PAINT消息的部分，输入部分我采用的是控制台方式。

----

**下面是输入范例：**

    genEAN13 111111111111
    genEAN13 1111111111111
    genEAN13 111111111111?

**编译参数：**

    cl.exe genEAN13.c /link user32.lib gdi32.lib

**效果图（可以用app扫的）：**

<center><img src="{{ site.cdn }}imgs/201411/13-ean-13-111111111111.png" style="max-width:100%;"/></center>

**代码如下**（主要就是WM_PAINT的部分，三目用的有点多，分行不自然 \_(:з」∠)\_）：

    /**
     * Name  : EAN13 Generator
     * Author: MewX
     * Date  : 2014.11.25
     **/

    #include <windows.h>
    #include <string.h>

    // global values
    #define BASE_WIDTH 3         // in pixel
    #define DEFAULT_LEN 140
    #define EXTRA_LEN 20
    #define CODE_WIDTH 7

    const char tab_abc[ 3 ][ 10 ][ CODE_WIDTH + 1] = {
      {
        "0001101",
        "0011001",
        "0010011",
        "0111101",
        "0100011",
        "0110001",
        "0101111",
        "0111011",
        "0110111",
        "0001011" },
      {
        "0100111",
        "0110011",
        "0011011",
        "0100001",
        "0011101",
        "0111001",
        "0000101",
        "0010001",
        "0001001",
        "0010111" },
      {
        "1110010",
        "1100110",
        "1101100",
        "1000010",
        "1011100",
        "1001110",
        "1010000",
        "1000100",
        "1001000",
        "1110100" }
    }; // tab_abc[ A/B/C ][ 0~9 ][ enc ]

    const char tab_left[ 6 ][ 10 ] = {
      { 'A', 'B', 'B', 'A', 'B', 'B', 'A', 'B', 'A', 'A' },
      { 'A', 'B', 'A', 'B', 'B', 'A', 'A', 'A', 'B', 'B' },
      { 'A', 'A', 'B', 'B', 'A', 'A', 'B', 'B', 'B', 'A' },
      { 'A', 'B', 'B', 'B', 'A', 'B', 'B', 'A', 'A', 'B' },
      { 'A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'B', 'B' },
      { 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A' }
    }; // tab_left[ 0~5 ][ 0~9 ]

    const char beg[ 4 ] = "101";
    const char mid[ 6 ] = "01010";
    #define end beg

    char szStrIn[ 100 ], szTempStr[ 100 ];
    int nStrInLen, errorCount;


    // gen functions
    LRESULT CALLBACK WndProc (HWND, UINT, WPARAM, LPARAM) ;
    void drawLine( HDC hdc, int p, int color, int *pos_x, int *pos_y );


    int WINAPI WinMain (HINSTANCE hInstance, HINSTANCE hPrevInstance,
              PSTR szCmdLine, int iCmdShow)
    {
      static TCHAR szAppName[] = TEXT ("genEAN13") ;
      HWND     hwnd ;
      MSG      msg ;
      WNDCLASS   wndclass ;
      int      i, odd, even;

      if( strlen( szCmdLine ) < 1 ) {
        MessageBoxW( NULL, L"命令行参数：\r\n  genEAN13.exe <12/13 digits>\r\n\
          （不区分大小写）\r\ne.g. genEAN13.exe 690123456789", L"MewX",
          MB_ICONINFORMATION );
        return 0;
      }

      // init str_in
      strcpy( szStrIn, szCmdLine ); // make a copy
      nStrInLen = strlen( szStrIn );
      errorCount = 0;

      // check digits
      for( i = 0; i < 12; i ++ )
        if( szStrIn[ i ] < '0' || szStrIn[ i ] > '9' )
          errorCount ++;

      if( errorCount != 0 ||
              strlen( szStrIn ) != 13 && strlen( szStrIn ) != 12 ) {
        MessageBoxW( NULL,
          L"Code length is 12 or 13!\r\nAnd should be digits!", L"MewX",
          MB_ICONINFORMATION );
        return 0;
      }



      // calc check code
      odd = even = 0;
      for( i = 0; i < 12; i += 2 ) odd += szStrIn[ i ] - '0';
      for( i = 1; i < 12; i += 2 ) even  += szStrIn[ i ] - '0';
      szStrIn[ 12 ] = ( ( even * 3 + odd ) % 10 == 10 ?
                '0' : ( 10 - ( even * 3 + odd ) % 10 + '0' ) );
      szStrIn[ 13 ] = '\0';



      // gen title
      sprintf( szTempStr, "Generated EAN13 of \"%s\" - by MewX", szStrIn );

      wndclass.style     = CS_HREDRAW | CS_VREDRAW ;
      wndclass.lpfnWndProc   = WndProc ;
      wndclass.cbClsExtra  = 0 ;
      wndclass.cbWndExtra  = 0 ;
      wndclass.hInstance   = hInstance ;
      wndclass.hIcon     = LoadIcon (NULL, IDI_APPLICATION) ;
      wndclass.hCursor     = LoadCursor (NULL, IDC_ARROW) ;
      wndclass.hbrBackground = (HBRUSH) GetStockObject (WHITE_BRUSH) ;
      wndclass.lpszMenuName  = NULL ;
      wndclass.lpszClassName = szAppName ;

      if (!RegisterClass (&wndclass)) {
        MessageBox (NULL, TEXT ("Program requires Windows NT!"),
              szAppName, MB_ICONERROR) ;
        return 0 ;
      }

      hwnd = CreateWindow (szAppName, szTempStr,
                 WS_OVERLAPPEDWINDOW,
                 CW_USEDEFAULT, CW_USEDEFAULT,
                 CW_USEDEFAULT, CW_USEDEFAULT,
                 NULL, NULL, hInstance, NULL) ;

      ShowWindow (hwnd, iCmdShow) ;
      UpdateWindow (hwnd) ;

      while (GetMessage (&msg, NULL, 0, 0)) {
        TranslateMessage (&msg) ;
        DispatchMessage (&msg) ;
      }
      return msg.wParam ;
    }

    LRESULT CALLBACK WndProc (
      HWND hwnd,
      UINT message,
      WPARAM wParam,
      LPARAM lParam )
    {
      static int  cxClient, cyClient ;
      HDC     hdc ;
      int     i, j, x, y;
      char temp;
      PAINTSTRUCT ps ;

      switch (message) {
      case WM_SIZE:
        cxClient = LOWORD (lParam) ;
        cyClient = HIWORD (lParam) ;
        return 0 ;

      case WM_PAINT:
        hdc = BeginPaint (hwnd, &ps) ;

      // draw EAN13
      temp = szStrIn[ 0 ]; // pos 13 code
      x = y = 30;

      // draw beg
      for( j = 0; j < 3; j ++ ) drawLine( hdc, 0, beg[ j ] - '0', &x, &y );
        TextOutA( hdc,  x - BASE_WIDTH * 10, y + DEFAULT_LEN,
            &szStrIn[ 0 ], 1 );

      for( i = 1; i < 13; i ++ ) { //skip first, and calc first 13 digits only
        for( j = 0; j < CODE_WIDTH; j ++ )
          drawLine( hdc, 1,
                tab_abc[ ( i < 7 ? tab_left[ 6 - i ][ temp - '0' ] :
                     'C' ) - 'A' ][ szStrIn[ i ] - '0' ][ j ] - '0',
                     &x, &y );

          TextOutA( hdc,  x - BASE_WIDTH * 5, y + DEFAULT_LEN,
              &szStrIn[ i ], 1 );

        // draw mid
        if( i == 6 ) for( j = 0; j < 5; j ++ )
            drawLine( hdc, 0, mid[ j ] - '0', &x, &y );
      }

      // draw end
      for( j = 0; j < 3; j ++ ) drawLine( hdc, 0, beg[ j ] - '0', &x, &y );
        TextOutA( hdc,  x + BASE_WIDTH, y + DEFAULT_LEN, ">", 1 );

        return 0 ;

      case WM_DESTROY:
        PostQuitMessage (0) ;
        return 0 ;
      }
      return DefWindowProc (hwnd, message, wParam, lParam) ;
    }


    void drawLine( HDC hdc, int p, int color, int *pos_x, int *pos_y )
    {
      // get left-top point pos_x & pos_y to draw
      // p  : 0 - longer, 1 - common
      // color: 0 - white, 1 - black
      int i;

      if( color == 1 ) {
        for( i = 0; i < BASE_WIDTH; i ++ ) {
          MoveToEx( hdc, *pos_x + i, *pos_y, NULL );
        LineTo( hdc, *pos_x + i, *pos_y + DEFAULT_LEN +
              ( p == 0 ? EXTRA_LEN : 0 ) );
        }
      }

      *pos_x += BASE_WIDTH;
      return;
    }
