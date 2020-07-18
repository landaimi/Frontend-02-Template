学习笔记

第二周

### 1、Js 语言通识 | 泛用语言分类方法

#### 语言按语法分类

- 非形式语言
  - 中文、英文
- 形式语言 
  - 计算机语言

#### 乔姆斯基谱系，四种类

- 0 - 无限制文法

- 1- 上下文相关文法

- 2- 上下文无关方法

- 3- 正则文法 (Regular)(正规文法)

  > 0123 是一种包含关系，上下文相关文法一定属于无限制文法，反之不成立

### 2、Js 语言通识 | 什么是产生式

#### 工具-产生式(BNF)

- 用尖括号括起来的名称表示语法结构名 <>

- 语法结构分成基础结构和需要用其他语法结构定义的复合机构（类似于叶子节点，不是代码终止的意思）
  - 基础结构，也叫终结符，terminal symbol
  - 复合结构，也叫非终结符，non-terminal symbol
- 使用引号和中间的字符，表示终结符（字符串）

- 可以有括号，变成一组

- *表示重复多次
- | 表示或
- +表示至少一次

#### 产生式的例子

```
//四则运算
	1 + 2 * 2
//终结符
	Number
	+ - * /
//非终结符
	MultiplicativeExpression
	AddtiveExpression
```

​	BNF:

```
<MultiplicativeExpression> ::=  <Number> | <MultiplicativeExpression> "*" <Number> | <MultiplicativeExpression> "/" <Number> | 
<AddtiveExoression> ::= <MultiplicativeExpression> | <AddtiveExpression> "+" <MultiplicativeExpression> | <AddtiveExpression> "-" <MultiplicativeExpression> |
```

#### 作业：

​	写带括号的四则运算产生式

```
//先定义四则运算的例子：
	2 +（（1+2）*3 +5）
//终结符：
	Number
	+ - * / ( )
```

- MultiplicativeOperator 简称 MO

- AddtiveOperator 简称 AO

- MultiplicativeExpression，简称 ME

- AddtiveExpression，简称 AE

- ParenthesisExpression, 简称 PE

#### BNF

```
<MO> ::= "*" | "/"
<AO> ::= "+" | "-"
<ME> ::= <Number>|<ME><MO><Number>
<AE> ::= <ME>|<AE><AO><ME>
<PE> ::= <AE>|<PE>|"("<AE>|<PE>")"|<PE><MO><PE>|<PE><AO><PE>
```

### 3、深入理解产生式

#### 	通过产生式理解乔姆斯基谱系

- 0型 无限制文法

  - ?:==?

- 1型 上下文相关文法

  - ?<A>? ::= ?<B>?

    > 问号分别为上文和下文

- 2型 上下文无关文法

  - <A> ::= ?

- 3型 正则文法

  - <A> ::= <A>?

**JavaScript总体上属于上下文无关文法，其中表达式部分大多数属于正则文法。**

特例： 2 ** 1 ** 2  //**表达式为右结合

```js
{
	get a {return 1},
	get : 1
}//严格意义上来讲 属于上下文相关文法
```

### 4、现代语言的分类

#### 语言的分类

- 形式语言-用途

  - 数据描述语言
    - JSON HTML XAML SQL CSS
  - 编程语言
    - C C++ Java Python Ruby JavaScript ....

- 形式语言-表达方式

  - 声明式语言 Declaritive

    - JSON, HTML, XAML, SQL, CSS, Lisp, Clojure, Haskell

  - 命令式语言  Imperative

    - C, C++, Python, Ruby, Per, Js

    大部分数据描述语言是声明式语言 

### 5、编程语言的性质

#### 图灵完备性

- 编程语言都必须要有图灵完备性
  - 命令式 - 图灵机
    - goto
    - if 和 while
  - 声明式 - lambda
    - 递归
    - lamda 基本的意思就是一种替换关系

#### 动态与静态

- 动态
  - 在用户的设备 / 在线服务器上
  - 产品实际运行时
  - Runtime
- 静态
  - 在程序员的设备上
  - 在产品开发时
  - Compiletime 

#### 类型系统

- 动态类型 vs 静态类型
  - Js 是动态类型
  - 在用户的机器上，能找到我们的类型
  - C++ 是静态类型
  - 只在程序员写代码的时候能保留的信息
  - Java 半静态，半动态；因为有反射机制
- 强类型与弱类型
  - 强类型 -- 类型转换不会默认发
  - 弱类型 -- 默认转换
- 复合类型
  - 结构体
  - 函数签名 -- 参数类型，返回类型
    子类型
- 泛型
  - 逆变 / 协变

### 6、一般命令式编程语言的设计方式

#### 一般命令式编程语言

总体上来讲，分为5个层级

- Atom（原子级）
  - Identifier  （标识符）
  - Literal（字面量）
- Expression（表达式）
  - Atom
  - Operator（运算符）
  - Punctuator（符号）
- Statement（声明）
  - Expression
  - Keyword
  - Punctuator
- Structure
  - Fuction
  - Class
  - Process
  - Namespace
- Program
  - program
  - module
  - package
  - library

**每个层级的思路：**

​	语法 --语义--> 运行时

### 7、Js 类型

字面值 和 运行时的类型

#### Atom

##### Grammar

- Literal
- Variable
- Keywords
- Whitespace
- Line Terminator

##### Runtime

- Types
- Execution Context

7 种（8种） 类型

前五种类型比较常用

- Number
- String
- Boolean
- Object
- Null
- Undefined
- Symbol


凡是我们进行赋值的都用 Null，而不是Undefined

###### Symbol

​	Symbol 是 Js 特有的一个概念

​	代替 String 作为 Object 的索引。或者说专门用于 Object 的属性名。

typeof null = 'object'

#### Number

IEEE 754 Double Float：一共64位

- Sign(1)
- Exponent(11)
- Fraction(52)

数中间有个 epsilon 的差别

​	0.toString(); // 会报错，因为 0. 是一个合法的数字

​	0 .toString() // 0后面加一个空格就不报错了

### 8、String

Character  ---> a

Code Point ---> 97

Encoding ---> 01100001

#### 编码形式，字符集

- **ASCI**I - 127
- **Unicode** - 化为各种片区
- **UCS**  - 0000-FFFF
- **GB** - 字符集和unicode的字符集不一致
  	**GB2312**
  	**GBK(GB13000)**
  	**GB18030**  -大全版本
- **IOS-8859**
- **BIG5**  - 台湾

#### 编码-Encoding

- UTF

  UTF8：默认用一个字节表示一个字符
  UtF 16：默认用16位表示一个字符
  中文的“一”，实际编码是：01001100000000

在 UTF8中，用三个字节表示。所以要插入控制位。

11100100 10111000 10000000

#### String - Homework

```js
function UTF8_Encoding(string) {
 // return new Buffer();
 // 把一个String 它代表的字节表示出来
}
```

#### 语法 - Grammar

```
"abc"
'abc'
`abc`
```

- 单、双引号完全等效

- 使用\转义

- 反引号 - Js 模板量 Template

- 可以回车，加 $符，花括号


#### String Template

##### \`ab\${x}abc${y}abc`

上面引入了两个字符串变量，x, y

${} 中是祼的 Js语法

在第一个反引号前面可以加函数名。

### 9、其他类型

### Boolean

-  true
-  false

 true, false 都是关键字

#### Null & Undefined

- null
- undefined
- void 0

undefined -- 没有人定义

null 是关键字 -- 但是 undefined 不是

undefined 是一个全局变量

早期的 Js 里面，可以为 undefined 赋值。比如 undefined = true

现在不行了。

但是，现在在函数里面，使用 undefined 作局部变更名还是可以的。

比如

```
function f() {
	var undefined = 1
	console.log(undefined)
}
```

**一般用 void 0 产生 Undefined 是最安全的。**

### 10、对象的基础知识 

Object 和 Symbol

相比 Object, Symbol 是配角。

三只一模一样的鱼，实际是三个对象。

一只鱼发生的变化，另一条鱼不受影响。

计算机使用三块不同的空间来存储这三条鱼。

- 任何一个对象都是唯一的，这和他本身的状态无关
- 就算两个对象的值全相等，他俩并不相等（不是同一个对象）
- 把对象当数据用
- 状态改变就是行为


##### 三个核心要素

- Identifier
- state
- behavior

对象的重要概念就是分类：

Object

- Animal
- Fish
- Sheep

#### 归类 vs 分类

==这两点怎么区分？==

只有有共性，就可以归于一个类。所以可以根据属性归为多个类。

对于归类来说 -- 多种继承是很自然的事

对于分类的计算机语言，单继承结构，有一个基类 Object

Java C# 分类思想

Js 也是分类

#### **原型**

更接近于人们原始对对象的认识。

不做严谨的分类，而是采用”相似“这样的方式去描述对象。

任何对象仅需描述它自己与原型的区别即可。

最终的原型：

object prototype -- 所有对象的祖宗
Nihilo 原型

class 适于严格的场景

class 和 type 是两个概念

##### 练习

行为 -- 是改变对象状态的动作。

狗咬人

class Dog {
	bite(human){
	... // 这个是错误的，因为行为不改变对象本身的状态
	}
}
业务逻辑 和 对象状态。

总是遵循行为改变状态的原则 -- 对象的行为必须是改变对象状态的！！！

高于一切的对象基本原则！！

违背了这个原则，整个对象的内聚性就没有了。

```js
class Dog {
	var name = 'a dog'
  var attackability = true
  var attackbehavior = 'bited'
  constructor(name) {
      this.name = name
  }
}

class Person {
	var name = 'a person'
  var hp = 100
  hurted(dog) {
      console.log(this.name, '\'s hp = ', this.hp)
      if (dog.attackablity) {
          console.log(dog.name, dog.attackbehavior, this.name)
      }
      else {
          console.log(dog.name, ' does not hurt')
      }
  }
}

p = new Person('John')
d = new Dog('Tom')
```

### 11、js中的对象

#### Object in Javascript

Object 下面有很多 Property 

##### **Symbol / String --> Data / accestor**

属性是kv 对。

Key 有两种 Symobl, String

两个 Symbol 即使名字一样，也不相等。

- Data property
  - [[value]]
  - writable
  - enumerable
  - configurable
- Accessor Property
  - get
  - set
  - enumerable
  - Configurable

- JavaScript使用属性来统一抽象对象的行为和状态
- 数据属性用于描述状态，访问器属性则用于描述行为
- 数据属性中如果存储函数，也可以用于描述行为

原生支持 原型机制。链式找原型。原型链，顺着原型链一直向上查找。

#### Object API/Grammar

- {} . [] Object.defineProperty
- Object.create / Object.setPrototypeOf / Object.getPrototypeOf
- new / class / extends
- new / function / prototype -- 不伦不类，不建议用。在 ES3 里用。

#### Function Object

typeof(a_function) --> function

带 call 方法的对象。

#### Special Object

Array[[length]]

Object.prototype[[setprototype]]

#### Host Object

宿主环境中的 Object，比如 Window，比如 SetTimeout

Object[[call]]

#### 作业：找出 Js里面所有具有特殊行为的对象。

Js 中的内置对象：

三个值：

Infinity, NaN, undefined